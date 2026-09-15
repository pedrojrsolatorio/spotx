# Implement Intelligent Search

## Goal

Build SpotX's intelligent search: the Sanity Context MCP connection, a server-side search API, and the search results page that renders **video results** and **lesson results** over the seeded courses and lessons. Per `AGENTS.md` §7 & §11, search is a full results page (not a chatbox): ranked matches, a result count, a sort control, lesson result cards, and video-moment result cards whose action opens the lesson page at the exact second.

## Skills read

- `create-agent-with-sanity-context`: MCP connection pattern (`createMCPClient` HTTP transport + Bearer token, `/initial-context` HTTP fetch with TTL cache, `groq_query` / `schema_explorer` / `initial_context` tools, exclude `initial_context` from LLM tools after injecting it into the system prompt).
- `dial-your-context`: Context document = `groqFilter` (content scope) + `instructions` (pure query deltas). Plugin may not support Sanity 5.31 -> configure by import (`app/studio/scripts/seed/context.ndjson`), per AGENTS §12.
- `shape-your-agent`: keep the system prompt to behavior + guardrails; data rules (grounding, token matching, ranking, video-document lookup) go in the prompt AND the Context instructions.

## Code inspected

- `package.json`: no `ai` / `@ai-sdk/*` / direct `zod`. `zod@4.6.4` present transitively. Stack is Next 16.3.3 App Router + React 19 + Tailwind v4. No `react-markdown` installed (results are structured cards, no prose reply).
- `sanity/lib/client.ts`: server-only read client (`SANITY_API_READ_TOKEN`, private dataset) — reuse for any REST fetch.
- `sanity/lib/data.ts`: `sanityFetch` (defineLive) returns StegaString-wrapped types; existing data helpers cast `as <QUERY>_RESULT`.
- Schemas: `course`, `lesson`, `category`, `instructor`. **No `video` document type** — required by §8/§9 for video-moment results.
- `components/hero.tsx`: search input is static (no submit). Needs wiring to `/search?q=`.
- Existing UI: `components/ui/card.tsx`, `button.tsx`, `badge.tsx`; `components/course-icon.tsx` maps icon strings. No `app/api/search`, no `app/search`.

## Decisions & assumptions

1. **LLM-driven search**: server route connects to Sanity Context MCP over HTTP (already requires a deployed Studio), injects `/initial-context` (cached 5 min), and uses `generateText` + `Output.object` (Vercel AI SDK v7 + Google provider) with a Zod discriminated union for structured results. The model writes GROQ via `groq_query`.
2. **New env vars** (server only, added to `.env.example`): `GOOGLE_GENERATIVE_AI_API_KEY` (required), optional `SEARCH_MODEL` (default `gemini-2.5-pro`), optional `SANITY_CONTEXT_SLUG` (context doc slug; base URL used when absent). MCP URL is built from `NEXT_PUBLIC_SANITY_PROJECT_ID` + dataset + optional slug; `SANITY_CONTEXT_MCP_URL` overrides if set.
3. **Install** `ai`, `@ai-sdk/google`, `@ai-sdk/mcp` as runtime deps.
4. **Video document schema added** (`video`: `id`, `url`, `chapters[{startSeconds,label}]`, `chunks[{startSeconds,text}]`) so the MCP can serve video docs. The **ingestion pipeline is out of scope** (`videos.json` has no transcripts/chapters) — search supports video results the moment video docs exist; until then only lesson results appear (grounded, never invented).
5. **Grounding**: the system prompt forbids inventing courses/lessons/timestamps/counts; video results must join `video.url == lesson.videoUrl` and carry a real `startSeconds` from a chapter or chunk.
6. **Token-based text match**: wildcard keywords (`*cache* || *caching*`), OR words, never whole-phrase patterns, use `pt::text(notes)`. Ranking by specificity; chapters beat transcript chunks.
7. **Context doc**: import file `sanity.agentContext` with `groqFilter: _type in ["course", "lesson", "video"]` + the same query guidance as `instructions`. Rules also live in the inline system prompt (AGENTS §11: model follows system prompt more reliably).
8. **Route**: `GET /api/search?q=...` returns JSON `{ query, count, courseCount, results[] }`. Client component fetches it. Errors -> 400/500 JSON; PostHog `search_performed` captured server-side isn't possible (no public key server-side), so capture `search_performed` + `search_started` on the client in the results component and hero.
9. **Sort control** (client-side): Most relevant (default, LLM order) / By course. Result count rendered as "found N results across M courses". Empty state links to the catalog.
10. Results are ranked by the LLM; no capability cap the model is told to return — but `maxResults` cap (40) protects context/UI.

## Files to touch

Create:
- `lib/search/schema.ts` — Zod schemas: `searchResponseSchema`, `lessonResultSchema`, `videoResultSchema` (discriminated by `type`).
- `lib/search/system-prompt.ts` — inline system prompt (role, grounding rules, two result kinds, token matching, ranking, video-lookup rules, output contract).
- `lib/search/sanity-context.ts` — `buildMcpUrl()`, `createSearchContext()` (MCP client + cached initial context), `fetchInitialContext()` with TTL.
- `app/api/search/route.ts` — GET handler validating `q`, calling `generateObject` with tools, returning JSON.
- `app/search/page.tsx` — server component, reads `searchParams.q`, renders `<SearchResults query={q}/>` (client), metadata, `Navigation`/`Footer`.
- `components/search/search-results.tsx` — client: fetches `/api/search?q=`, loading/error/empty states, count header, sort control, renders result cards; PostHog capture.
- `components/search/result-card.tsx` — renders video result and lesson result cards with course chip, module/lesson label, description, key points / matched second, CTA link (video -> `/lesson/{slug}?start={seconds}`, lesson -> `/lesson/{slug}`).
- `sanity/schemaTypes/documents/video.ts` — video document schema (id, url, chapters, chunks). Register in `sanity/schemaTypes/index.ts`.
- `app/studio/scripts/seed/context.ndjson` — `sanity.agentContext` import (instructions + groqFilter).

Modify:
- `components/hero.tsx` → make the search input a submit form that `router.push("/search?q=...")`; PostHog `search_started`.
- `.env.example` → add `OPENAI_API_KEY`, `OPENAI_MODEL`, `SANITY_CONTEXT_SLUG`, `SANITY_CONTEXT_MCP_URL` commented.

## Requirements

- Search is server-only end to end: browser never holds a token, never calls MCP/LLM.
- Results page is a client component consuming the API response (AGENTS §5).
- Video result links to lesson page with `?start={seconds}`; lesson player already honors `start` param.
- Lesson label formatting (e.g., "Lesson 5.1", "Module 3") derived by the model from course module order and returned in the payload.
- No whole-transcript/chunks arrays returned to the model (prompt instructs fetching only filtered matches).
- Typegen regenerated after adding `video` schema.

## Security

- All new keys server-only; only client-safe values exposed. `.env.example` updated (no real values).
- Validate + clamp `q` (trim, max length); return 400 on empty.
- MCP URL constructed server-side; bearer token never logged.
- LLM output validated with Zod before returning; any shape violation -> 500.

## Acceptance criteria

- `GET /api/search?q=caching` returns `{query, count, courseCount, results}` where each result is `video` or `lesson` shaped per Zod.
- `/search?q=...` renders: count header, sort control, lesson cards (course chip, key points, description, CTA) and video cards (course chip, lesson label, thumbnail, clip, matched second, `?start=` CTA) when video docs exist; empty state otherwise.
- Hero search submits and navigates to `/search?q=...`.
- Lint 0 errors; scoped `tsc --noEmit` clean; `npm run typegen` succeeds (video type added).

## Checks to run

1. `npm install ai @ai-sdk/google @ai-sdk/mcp`
2. `npm run typegen`
3. `npm run lint`
4. Scoped `npx tsc --noEmit -p tsconfig.scoped.json`
5. Sandbox cannot reach Sanity/OpenAI (network allowlist) — live MCP verification must happen on the user's machine.

## Manual test steps (user, locally)

1. Add env: `OPENAI_API_KEY`, dataset/project already set; optional `SANITY_CONTEXT_SLUG`.
2. Ensure Studio is deployed (`npx sanity deploy` in studio workspace) so the Context MCP serves the dataset.
3. Import context doc: `npx sanity dataset import ... context.ndjson` (or create in Studio).
4. `npm run dev` → homepage → type "caching and revalidation" → submit → lands on `/search?q=...`, see lesson results ranked; if video docs exist, see video results with `?start`.
5. Click a video result → lesson page video starts at the matched second.

## Out of scope (next tasks)

- Video ingestion pipeline (transcripts → `chunks`, chapter sources → `chapters`).
- Conversation Insights / telemetry.