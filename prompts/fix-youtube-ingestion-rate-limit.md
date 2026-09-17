# Fix: YouTube ingestion fails with 429 / "no video chunks in Studio"

## Goal

Make `npm run ingest:videos` actually produce `video.ndjson` (non-empty) so the `video` documents with `chunks[]` and `chapters[]` can be imported into Sanity. Today the run dies at `[1/120] youtube: Rate limited after retry: 429` and `app/studio/scripts/seed/video.ndjson` stays 0 bytes.

## Root cause

`app/studio/scripts/ingest/providers/youtube.mjs` fetches the YouTube watch page anonymously with a plain browser UA (`fetchWithRetry`) and extracts `ytInitialPlayerResponse`. YouTube now returns 403/429 to such requests at IP level — even the first request gets blocked (verified: a bare `fetch` of `https://www.youtube.com/watch?v=9602Yzvd7ik` returns 403 with no player response from this network; the user's machine got 429 on video 1/120). At 120 videos (240+ requests) bumping `delayMs`/retries cannot fix it.

## Skills read

None of the listed project skills apply (this is an offline CLI bug fix, not schema/search/analytics work). `node_modules/next/dist/docs/` is not relevant (no app code).

## Code inspected

- `app/studio/scripts/ingest/ingest-videos.mjs` — CLI orchestration; `providerSource(url, delayMs)` picks the provider; YouTube path expects `{ segments, description }` and derives chapters via `chaptersFromDescription`.
- `app/studio/scripts/ingest/providers/youtube.mjs` — watch-page scrape + json3 timedtext → segments.
- `app/studio/scripts/ingest/providers/vimeo.mjs` — already parses **WebVTT** into `{ startSeconds, text }` (`fetchTextTrackSegments` VTT branch); same parsing needed for YouTube.
- `app/studio/scripts/ingest/lib/{fetch,chunker,chapters,video-id,document}.mjs` — shared plumbing, unchanged.
- `app/studio/scripts/seed/videos.json` / `seed.ndjson` — 120 unique YouTube URLs (all YouTube), drives the run.
- `app/studio/scripts/seed/video.ndjson` — 0 bytes today.
- `ingest-videos.test.mjs` + `__fixtures__/` — tests for the old scrape path.

## Decisions & assumptions

1. **Replace the YouTube scrape with `yt-dlp`** (`pip install yt-dlp`, or the standalone binary; on Windows `winget install yt-dlp`). It uses YouTube's internal client, survives bot/PoToken checks, and has built-in `--sleep-requests` / `--retries`. This is the de-facto standard for bulk YouTube info+subtitle extraction.
2. **Diet two yt-dlp invocations per video**:
   - `yt-dlp -J --no-warnings <url>` → single JSON with `description`, `chapters` (`[{start_time,title}]`), and `subtitles`/`automatic_captions`.
   - `yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "en.*" --sub-format vtt --no-warnings -P <tmpdir> -o <tmpdir>/<id> <url>` → writes `<tmpdir>/<id>.<lang>.vtt`. Read it, parse to segments via a shared VTT parser (lift the Vimeo VTT logic into `lib/webvtt.mjs`), then delete the temp file. Using yt-dlp to *write* subs (rather than fetching its caption URL ourselves) is safest: it applies cookies/signature decode that a raw `fetch` may miss.
3. **Chapters**: prefer `info.chapters` → `{ startSeconds: start_time, label: title }`; fall back to `chaptersFromDescription(info.description)` (existing parser).
4. **Provider contract** becomes `{ segments, chapters }` for all three providers; `ingest-videos.mjs`'s YouTube branch no longer re-derives chapters (it stops using `chaptersFromDescription` there).
5. **Rate limiting flags**: map the existing `--delay` CLI flag to `--sleep-requests`; pass `--sleep-subtitles` for the sub fetch and `--retries 5 --file-access-retries 5`. Keep per-video try/catch and the done summary as-is.
6. **Binary resolution order**: `YTDLP_BIN` env var, then `yt-dlp` on `PATH`. If missing, a clear error: "yt-dlp not found. Install it (pip install yt-dlp / winget install yt-dlp) or set YTDLP_BIN." The script keeps the f available `--dry-run` path.
7. **Dry-run/test fixtures** switch from watch-page/json3 to: `yt-dlp-info.json` (the `-J` output) and `caption-track.vtt`. `extractPlayerResponse`, `parseJson3Segments`, and the `watch-page.html`/`caption-track.json3` fixtures are removed; the shared VTT parser is unit-tested.
8. A stale `--tmpdir` (os.tmpdir/`ytdl-<id>`) is cleaned up in a `finally`. No other files touched. Nothing in the app request path changes.

## Files to touch

Modify:
- `app/studio/scripts/ingest/providers/youtube.mjs` — yt-dlp-backed `fetchYouTubeVideo({ youtubeId, delayMs, tmpDir })` returning `{ segments, chapters }`.
- `app/studio/scripts/ingest/ingest-videos.mjs` — youtube branch uses the new return shape; map `--delay` → sleep flags; tmp dir handling.
- `app/studio/scripts/ingest/providers/vimeo.mjs` — import the shared VTT parser instead of its inline branch.
- `app/studio/scripts/ingest/ingest-videos.test.mjs` — replace json3/watch-page tests with `lib/webvtt` + yt-dlp-info mapping tests; keep all others.
- `app/studio/scripts/ingest/__fixtures__/` — add `yt-dlp-info.json`, `caption-track.vtt`; remove `watch-page.html`, `caption-track.json3` (and their references).

Create:
- `app/studio/scripts/ingest/lib/webvtt.mjs` — parse VTT subtitles → `[{ startSeconds, text }]`, dedupe overlapping cues, skip headers/blank lines; reuse in Vimeo.
- `app/studio/scripts/ingest/lib/ytdlp.mjs` — `resolveYtDlp()`, `runYtDlp(args, opts)` (`child_process.spawnSync/respawn` wrapper), `fetchWithYtDlp({ youtubeId, delayMs, tmpDir })` orchestrating the two calls + cleanup.

## Requirements

- `npm run ingest:videos` succeeds on the user's machine and writes non-empty `video.ndjson` (one `video` doc per unique URL, `_id`/`id`/`url`/`chapters[]`/`chunks[]`).
- Chunks stay short/timestamped ≤ ~480 chars, grounded in real captions; chapters grounded in yt-dlp data or description lines.
- No new npm runtime deps for the pipeline beyond the yt-dlp binary itself (documented, env-overridable).
- Dry run + unit tests pass fully offline (this sandbox cannot reach YouTube — the live run is verified on the user's machine).

## Security

- No API keys or secrets added. yt-dlp uses public endpoints.
- Network access is limited to YouTube (yt-dlp) — same trust boundary as before.

## Acceptance criteria

- `npm run test:ingest` passes (VTT parser, chapter-from-info mapping, id derivation, chunker, existing doc build).
- `node app/studio/scripts/ingest/ingest-videos.mjs --dry-run` prints the manifest count + a sample doc built **from the new fixtures**, no network.
- On the user's machine: `npm run ingest:videos` finishes with `Done: 120 built, 0 failed` (or near-total; failures are per-video and summarized) and `video.ndjson` > 0 bytes.
- `npx sanity dataset import app/studio/scripts/seed/video.ndjson production` imports cleanly; re-import is idempotent (same `_id`s upsert).
- A GROQ spot check `*[_type == "video"][0..2]` shows non-empty `chunks[]` in Studio.
- No change to app pages/routes/render — lint + typecheck stay clean.

## Checks to run

1. `npm run test:ingest`
2. `node app/studio/scripts/ingest/ingest-videos.mjs --dry-run`
3. `npm run lint`
4. Live (user's machine): `npm run ingest:videos`, then import, then GROQ spot-check.

## Manual test steps (user, locally)

1. Install yt-dlp (`pip install yt-dlp` or `winget install yt-dlp`).
2. `npm run ingest:videos` → watch progress to 120; open `app/studio/scripts/seed/video.ndjson`, spot-check `chapters`/`chunks`.
3. `npx sanity dataset import app/studio/scripts/seed/video.ndjson production`.
4. In Studio, check `video` docs have `chunks`; search a phrase from a transcript → video result opens at matched second.

## Out of scope

- Bunny ingestion (blocked on playback support, unchanged).
- Vimeo live re-testing (unchanged behavior, only the shared parser is reused).
- Semantic search / embeddings.