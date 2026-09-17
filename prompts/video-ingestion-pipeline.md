# Video Ingestion Pipeline (offline)

## Goal

Build the offline tooling that populates Sanity `video` documents — one per unique lesson video URL — with a timestamped transcript split into short `chunks[]` and a `chapters[]` table of contents. It runs as a standalone Node CLI (never in the request path) and outputs NDJSON ready for `sanity dataset import`, mirroring the existing seed workflow.

## Skills read

- `sanity-best-practices` (migration doc): NDJSON import format, document identity. The general rule says let Sanity generate `_id`s, but `AGENTS.md` §9 explicitly requires video docs to be **keyed by an id derived from the video URL** (datastore-safe). I follow AGENTS.md: deterministic `_id` makes re-imports idempotent for this singleton-like internal lookup.

## Code inspected

- `app/studio/scripts/seed/videos.json` — manifest keyed by lesson slug: `{ id, title, channel, duration, query }`; 120 YouTube videos.
- `app/studio/scripts/seed/seed.ndjson` — lesson docs carry `videoUrl` = `https://www.youtube.com/watch?v=<id>` (120, all YouTube). This is the authoritative source of the video URLs to ingest (drives the pipeline; `videos.json` is used as the id/key cross-check).
- `sanity/schemaTypes/documents/video.ts` — `video` doc: `id`, `url`, `chapters[] {startSeconds, label}`, `chunks[] {startSeconds, text}`.
- `sanity.types.ts` — generated `Video` type matches.
- `components/lesson-video-player.tsx` — playback supports YouTube (with `?start=` seek) and Vimeo; **Bunny falls through to a raw URL (unsupported)**.
- `package.json` — no test framework; Node v22 (native `node --test` is available). Existing npm scripts: `dev/build/start/lint/typegen`.

## Decisions & assumptions

1. **Source of video URLs**: parse `seed.ndjson` for unique `lesson.videoUrl` values (default). This is ground truth — each unique URL becomes one `video` document regardless of how many lessons reference it. `videos.json` is the fallback manifest (`--manifest`).
2. **YouTube ingestion** (fully supported): fetch the watch page with a browser UA + `Accept-Language`; extract `ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks`; prefer the manual track (`kind !== "asr"`), fall back to auto-generated; fetch the timedtext `baseUrl` with `fmt=json3`; parse `events[]` (`tStartMs`, `segs[].utf8`) into plain segments; group segments into short chunks (≤ ~480 chars, break at sentence boundaries) each carrying the first segment's `startSeconds`; parse chapters from `videoDetails.shortDescription` timestamp lines (`0:00 Intro` / `1:23:45 ...`).
3. **Vimeo ingestion** (supported): fetch `https://player.vimeo.com/video/{id}/config`; captions from `request.text_tracks[].url` (fetch each and reuse the same chunker on its segments); chapters from `request.chapters` when present, else empty.
4. **Bunny**: NOT supported — playback isn't wired, and per AGENTS §9 a provider must have both ingestion and playback to count as supported. The provider prints a clear skip + reason.
5. **Id derivation**: `video.yt.<youtubeId>` / `video.vimeo.<numericId>`, sanitized to the allowed `[a-zA-Z0-9._-]` set and lowercased; used for `_id` and the schema's `id` field. `url` keeps the canonical provider URL (same string the lesson uses).
6. **Output**: `app/studio/scripts/seed/video.ndjson` with one complete document per line. Re-running overwrites same `_id`s (dataset import upserts) — idempotent.
7. **Resilience**: UA-simulated fetch with a retry (1) and a default 800 ms delay between requests; per-video failures are caught, counted, and summarized; exit 0 unless nothing succeeded or the manifest is missing (exit 1).
8. **`--dry-run` mode**: skips network, validates the whole shape against recorded fixtures (a `json3` caption payload, an extracted player response, and a chapter description) so parsing is verified offline. The sandbox cannot reach YouTube (403 bot check), so live runs happen on the user's machine.
9. **Tests**: `node --test` over pure functions (id derivation, json3→segments, chunker, chapter parser, url→provider) using the fixtures. No new test framework dependency.

## Files to touch

Create:
- `app/studio/scripts/ingest/ingest-videos.mjs` — CLI entry: read sources, orchestrate providers, write `video.ndjson`, dry-run, progress + summary.
- `app/studio/scripts/ingest/providers/youtube.mjs` — watch-page fetch, playerResponse extraction, caption track selection, timedtext (json3) fetch → segments.
- `app/studio/scripts/ingest/providers/vimeo.mjs` — config fetch, text-track fetch → segments, chapters.
- `app/studio/scripts/ingest/providers/bunny.mjs` — unsupported stub (clear skip reason).
- `app/studio/scripts/ingest/lib/video-id.mjs` — provider detection + datastore-safe id derivation from any supported URL.
- `app/studio/scripts/ingest/lib/chunker.mjs` — caption segments → short timestamped chunks.
- `app/studio/scripts/ingest/lib/chapters.mjs` — description text → `{startSeconds, label}[]`.
- `app/studio/scripts/ingest/lib/fetch.mjs` — UA fetch with retry + delay.
- `app/studio/scripts/ingest/__fixtures__/` — sample json3 payload, sample player-response JSON, sample chapters description.
- `app/studio/scripts/ingest/ingest-videos.test.mjs` — `node --test` unit tests.

Modify:
- `package.json` — add scripts `ingest:videos` and `test:ingest`.

## Requirements

- Runs only offline from a terminal; never imported by the app.
- Chunks are short and timestamped (`startSeconds`, `text`); no whole-transcript field is ever stored.
- Chapters become the table of contents; if a video has none, leave `chapters` empty (search already falls back to chunks).
- Grounded: only real caption/chapter data from the provider; never fabricated.

## Security

- Public endpoints only — no API keys needed. No tokens, no secrets in the CLI or output.
- Outbound requests limited to YouTube (watch page + timedtext) and Vimeo (player config + captions).

## Acceptance criteria

- `npm run test:ingest` — all tests pass (chunker segmentation + startSeconds, chapter parsing incl. hour-formats, id sanitization, URL→provider).
- `node app/studio/scripts/ingest/ingest-videos.mjs --dry-run` runs offline and prints the expected manifest count + shapes.
- On the user's machine: `npm run ingest:videos` produces `app/studio/scripts/seed/video.ndjson` with one `video` doc per unique video URL; each has `_id`, `id`, `url`, `chapters[]`, and non-empty `chunks[]`.
- `npx sanity dataset import app/studio/scripts/seed/video.ndjson production` imports without errors; re-run doesn't duplicate.
- Searching after import returns chapter/chunk-derived video results (search wiring already exists).

## Checks to run

1. `npm run test:ingest`
2. `node app/studio/scripts/ingest/ingest-videos.mjs --dry-run`
3. `npm run lint` (still 0 errors — no app code changed, sanity check)
4. Live run + import + a GROQ spot-check (`*[_type == "video"][0...3]`) on the user's machine; confirm search video results.

## Manual test steps (user, locally)

1. `npm run ingest:videos` → watch progress; open `app/studio/scripts/seed/video.ndjson`; spot-check one doc's `chapters`/`chunks`.
2. `npx sanity dataset import app/studio/scripts/seed/video.ndjson production`
3. Re-run ingest + import to confirm idempotency.
4. Homepage → search a phrase that appears in a transcript → toggle to a video result → video opens at the matched second.
5. Re-run `npx sanity deploy` for the deployed Studio if schema was untouched (it was — no schema change).

## Out of scope

- Bunny ingestion (blocked on playback support in `lesson-video-player.tsx`).
- Transcript → semantic tiling or embeddings; live caption refresh.