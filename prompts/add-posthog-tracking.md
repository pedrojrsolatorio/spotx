# Add PostHog tracking for search, video consumption, and engagement

## Goal

Wire up PostHog analytics for the learner engagement features built since the basic setup: search performed, search results opened, video play, watch depth, and lesson completion (as a watch-depth proxy, since no completion UI exists). Follow PostHog's Next.js App Router best practices (existing project patterns throughout — no new conventions). Keep the browser/server boundaries from AGENTS.md §5.

## Skills read

- `integration-nextjs-app-router` (`.claude/skills/...`): references `1-begin`, `2-edit`, `EXAMPLE`, `COMMANDMENTS`, `next-js`, `identify-users`.

## Code inspected

- `instrumentation-client.ts` — client init exists (Next 15.3+ `instrumentation-client` pattern: `posthog.init` with `defaults` + `capture_exceptions`, dev throws when unconfigured). Correct; no change.
- `lib/posthog-server.ts` — `getPostHogClient()` singleton, `flushAt: 1`, `flushInterval: 0`, `enableExceptionAutocapture`. Correct; no change.
- `app/providers.tsx` — identifies with the Neon auth user id (note: app runs **Neon** auth, not Clerk; the user's "Clerk user ID" = the existing authenticated user id PostHog already has), captures `user_logged_in`/`user_logged_out`, resets on logout. No change.
- `app/api/auth/[...path]/route.ts` — existing server-side pattern: distinct id from `x-posthog-distinct-id` header (or `crypto.randomUUID()`), `capture` + `flush`, `captureException` on error. **Mirror this pattern in the search route.**
- `components/search/search-results.tsx` — has client `search_started` (submit) and client `search_performed` (after fetch, in `.then()`). Move authoritative `search_performed` server-side; drop the client duplicate; keep `search_started`.
- `components/search/result-card.tsx` — no tracking. Add `search_result_opened`.
- `components/lesson-video-player.tsx` — plain provider iframe embed, `autoplay=1`. No tracking. Add play/progress/completion events via the YouTube iframe widget protocol (postMessage). All seeded videos are YouTube.
- `app/lesson/[slug]/page.tsx` — server component rendering the player; has course, module/lesson labels, `start` search param. No lesson-view tracking; no completion/resume UI (grep confirms none anywhere — progress feature not built).
- `.env.example` — missing PostHog vars. Add them; server keys stay server-only per AGENTS.md §12.

## Decisions and assumptions

- Use only the **existing authenticated user id** PostHog already has (via `identify` in `providers.tsx`). Server events correlate through the `x-posthog-distinct-id` / `x-posthog-session-id` headers (pattern already used by the auth route). No email, name, or other PII in any `capture` property. The search `query` text is intentionally captured because tracking search is the explicit, central purpose of this request (a user-generated-search dimension, not personal identity data).
- **`resume used` is NOT tracked** — there is no resume affordance or progress store in the app.
- **`lessons completed` is tracked as a watch-depth proxy**: `video_completed` fires when watch depth reaches ≥ 95% of the video duration. No fake "lesson completed" event.
- Event names follow the existing project's snake_case convention (e.g. `course_modules_toggled`, `search_performed`).
- The provider embed stays the provider's own player; we only listen to postMessage events. YouTube gets full watch-depth via the documented widget protocol (`enablejsapi=1`, `listening`/`command`/`infoDelivery`). Vimeo/Bunny (no `enablejsapi`) get `video_play`/`video_viewed` best-effort on load; no depth today (acceptable: zero Vimeo/Bunny content is seeded).
- Guard all client captures behind `isPostHogConfigured()`; server client already no-ops when unconfigured (`getPostHogClient`).
- Build nothing beyond tracking (AGENTS.md: "Do not overbuild").

## Files to touch

1. `lib/posthog-client.ts` **(new)** — tiny client helper:
   - `isPostHogConfigured(): boolean`
   - `posthogCapture(event: string, properties?: Record<string, unknown>): void` (guarded)
   - `getClientDistinctHeaders(): Record<string, string>` returning `x-posthog-distinct-id` (from `posthog.get_distinct_id()`) and `x-posthog-session-id` (from `posthog.get_session_id()`), wrapped in try/catch.
2. `components/search/search-results.tsx` — keep `search_started`; remove the client `search_performed` block in `.then()`; send `getClientDistinctHeaders()` on the `/api/search` fetch.
3. `components/search/result-card.tsx` — add `onClick` handlers on the result Links (video card CTA + thumbnail, lesson card CTA) capturing `search_result_opened` with `{ result_type, course_title, course_slug, module_label, lesson_label, lesson_slug, seconds?, result_position? }`. Keep it to one capture per click (use a callback shared by both links in a card).
4. `lib/video-tracking.ts` **(new)** — `useLessonVideoAnalytics({ videoUrl, startSeconds, context })` client hook:
   - YouTube: `enablejsapi=1`, postMessage widget protocol, poll `getCurrentTime`/`getDuration` on an interval; state `1` ⇒ `video_play`; throttle `video_watch_progress` (`current_seconds`, `percent_watched`, `duration`) to about every 15 s and flush on `pagehide`/unmount; at ≥ 95% ⇒ `video_completed` (once). Start-seconds aware.
   - Other providers: `video_play` on first embed load; no depth.
   - All events include `{ provider, video_id, lesson_slug, course_title, module_label, lesson_label, start_seconds }` via `context`.
5. `components/lesson-video-player.tsx` — accept `tracking` context prop and `startSeconds` already present; call the hook.
6. `components/lesson-tracker.tsx` **(new)** — small client component capturing `lesson_viewed` on mount with `{ course_slug, course_title, lesson_slug, module_label, lesson_label, free_preview, start_seconds }`.
7. `app/lesson/[slug]/page.tsx` — pass tracking context to `LessonVideoPlayer`; render `<LessonTracker …/>`.
8. `app/api/search/route.ts` — server-side: `getPostHogClient()`; before returning result, `capture({ distinctId, event: "search_performed", properties: { query, result_count, course_count, duration_ms, model, success: true } })` then `await flush()`. In the catch block, `captureException(error, distinctId, { … })` plus `search_failed` with `{ query, duration_ms }`, then `await flush()`. Distinct id from `x-posthog-distinct-id` header ?? `crypto.randomUUID()` (same as auth route).
9. `.env.example` — add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=` and `NEXT_PUBLIC_POSTHOG_HOST=` (Public token only; values already present in `.env.local`, no secrets added).

## Security

- No server-only values reach the browser; PostHog public project key only (already `NEXT_PUBLIC_`).
- No PII in capture properties beyond the pre-existing user id.
- No new env files or secret keys.
- Search query captured by design (see Decisions).

## Acceptance criteria

- `search_started` fires when a search is submitted.
- `search_performed` fires exactly once per API search request (server-side), with counts + duration + model + query; no client duplicate.
- `search_result_opened` fires on result click with result type and lesson/course context.
- `video_play` fires when the YouTube embed actually starts playback; `video_watch_progress` throttled updates; `video_completed` at ≥ 95 %.
- `lesson_viewed` fires on lesson page mount.
- No new bundling of `posthog-node` in client code; `posthog-js` stays browser-only.
- `.env.example` documents the PostHog vars.

## Checks to run

- `npx tsc --noEmit` (repo root) — clean.
- `npm run lint` — same pre-existing warning state as baseline; no new errors (full-project lint may OOM in this sandbox; fallback: `npx eslint` on the changed files).
- `npm run dev` on the user's machine for the manual test steps below.

## Manual test steps (user machine)

1. `npm run dev`, open `/search?q=caching`.
2. DevTools → Application → Local Storage → `ph_*_posthog` → confirm `search_started` and `search_performed` in the PostHog debug/network (`?__posthog_debug=true` shows events in console).
3. Click a video result → expect `search_result_opened` (type `video`) and, on the lesson page, `lesson_viewed` then `video_play`.
4. Let the video play ≥ 15 s → `video_watch_progress`; scrub to the end (≥ 95 %) → `video_completed`.
5. Check all events with correct properties in app.posthog.com (or PostHog console/network tab).