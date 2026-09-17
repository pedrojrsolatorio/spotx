# Rate limit the search endpoint

## Goal

Protect `GET /api/search` from abuse. It currently calls Gemini and the Sanity
Context MCP with no throttling, so a script or runaway client can drive up LLM
and Context cost with repeated requests. Add a cheap, dependency-free,
per-user sliding-window limiter that returns HTTP 429 before any MCP/LLM work.

## Skills read

- AGENTS.md (loop, boundaries, checks, git rules)
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`
  (Rate limiting section — host-provided limiting plus a `@/lib/rate-limit`
  style check in the route; return 429 on limit)

## Code inspected

- `app/api/search/route.ts` — the GET handler; today it has only a query
  length cap (200), an empty-query 400, and a missing-key 500. No limiting.
- `components/search/search-results.tsx` — the client already sends
  `x-posthog-distinct-id` via `getClientDistinctHeaders()` on every
  `/api/search` fetch, so we can key the limiter on the same identity the
  server route already uses for analytics. Its non-ok branch surfaces the
  server error message, so a 429 shows up in the existing error state without
  client changes.
- `.env.example` — no new env vars needed (in-memory store).
- Root `package.json` — no `@upstash/ratelimit`, no Redis. Toothless to build
  production distributed limiting here; in-memory is the honest choice.

## Decisions and assumptions

- **Store: in-memory sliding window.** Zero dependencies, no env vars, works
  and is testable in this sandbox. Documented tradeoff: on serverless hosts
  the window is per warm module instance, not global. The loop
  (single-instance learning platform) accepts that; comment makes it explicit.
- **Limits: 10 requests per 60 s burst, 50 per 3600 s hour**, each window
  checked independently, both keyed by the same identity.
- **Identity resolution** (lowest to highest precedence):
  `x-forwarded-for` first IP → `anonymous`. The `x-posthog-distinct-id`
  header would be ideal but is only sent from the search page; "anonymous"
  falls back to the forwarded IP, which browsers and Vercel provide. Actually
  use distinct-id first (nice for logged-in users and matches analytics),
  then XFF, then anonymous.
- **Ordering:** run the rate-limit guard first, before the 400/500 checks and
  before MCP/LLM work, so a fan of invalid queries also costs nothing.
- **Response:** 429 with a JSON error the client already renders, plus a
  `Retry-After` header in seconds.
- **No client change.** The error branch in `search-results.tsx` already
  renders the server-provided message.

## Files to touch

- New `lib/rate-limit.ts` — generic sliding-window limiter factory plus a
  `checkSearchRateLimit(request)` helper wired to the 10/50 limits.
- `app/api/search/route.ts` — call the guard at the top of `GET`.
- `.env.example` — no change.

## Implementation sketch

`lib/rate-limit.ts`:

- `createSlidingWindowLimiter(now = Date.now)` returns a `check(key,
  windows)` function. State is a `Map<string, number[]>` of hit timestamps
  per key. On each call: prune hits older than the largest window; for each
  window, count hits inside `windowMs`; if `count >= max`, return
  `{ limited: true, retryAfterMs }` where retryAfterMs is derived from the
  oldest in-window hit; else record the new timestamp and return
  `{ limited: false }`.
- `getRateLimitIdentity(request)` → distinct-id header, else first XFF
  entry, else `"anonymous"`.
- `searchRateLimiter` singleton and `SEARCH_LIMITS`:
  `[{ max: 10, windowMs: 60_000 }, { max: 50, windowMs: 3_600_000 }]`.
- `checkSearchRateLimit(request)` → `Response | null`; null when allowed,
  429 with the message and `Retry-After` when limited.

`route.ts` `GET`:

```ts
const limited = checkSearchRateLimit(req);
if (limited) return limited;
// existing checks unchanged
```

## Requirements

- Dependency-free; no new packages, no new env vars.
- No behavior change to successful searches or existing error paths.
- Identity never keyed on untrusted client values beyond the header we
  already trust for analytics.
- 429 returned before any MCP client is created or LLM is called.

## Security considerations

- Limiter is process-local memory; document that it is per-instance on
  serverless. Do not claim it is global.
- Keep the rate-limit map unbound per key; pruning drops the key when its
  hits age out of the largest window, so memory stays small.
- Do not log or expose the identity upstream.

## Acceptance criteria

- 11th search within a minute → 429 with `Retry-After`.
- 51st within an hour → 429 even if minute window is quiet.
- Valid query at odd minutes still returns results (windows keyed by sliding
  time from now).
- Empty query still returns 400 only when not rate-limited.
- `npx tsc --noEmit` clean; scoped eslint clean on both touched files.

## Checks to run

- `npx tsc --noEmit`
- `npx eslint lib/rate-limit.ts app/api/search/route.ts`
- Manual curl burst: 11 rapid `curl -H "x-forwarded-for: 203.0.113.7"
  'localhost:3000/api/search?q=x'` calls against the dev server → first 10
  200/500-path (env key), 11th 429 with Retry-After.

## Manual test steps

1. `npm run dev` in web workspace.
2. `for i in $(seq 1 12); do curl -si -H "x-forwarded-for: 203.0.113.7"
   'http://localhost:3000/api/search?q=closures' | head -1; done`
3. Expect 10 responses that are not 429, then 429 on 11 and 12.
4. Repeat without the header → all limited under the `anonymous` key after a
   few hits.