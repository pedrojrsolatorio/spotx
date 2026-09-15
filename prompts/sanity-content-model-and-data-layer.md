# Implementation Prompt: Sanity Content Model, Studio, and Read Data Layer

## Goal
Implement the SpotX Sanity content model (course, module, lesson, instructor, category), make the Studio authoring experience for those types usable, and build the server side read client plus the typed GROQ data layer that pages will consume.

Scope is deliberately tight per AGENTS.md section 1: content model + Studio + read data layer only. No pages, no search, no ingestion, no video documents, no progress records, no Clerk wiring.

## Skills read
- `sanity-best-practices` (references: `schema`, `groq`, `nextjs`, `project-structure`, `typegen`).
- `create-agent-with-sanity-context` reference `ecommerce` — used its `sanity/lib` client/queries patterns as the endorsed app-side shape.

## Code inspected
- `sanity.config.ts`, `sanity.cli.ts`, `sanity/env.ts`, `sanity/structure.ts` — existing embedded Studio config, empty schema, default structure.
- `sanity/schemaTypes/index.ts` — empty `types: []`.
- `sanity/lib/client.ts`, `sanity/lib/live.ts`, `sanity/lib/image.ts` — CDN client, `defineLive` without tokens, image url builder.
- `app/studio/[[...tool]]/page.tsx` — Studio mounted at `/studio` via `next-sanity/studio`.
- `package.json` — sanity 5.31.2, next 16.3.3, next-sanity 13.3.4, react 19. `@sanity/icons`, `groq`, `server-only` are present in `node_modules` but not declared in `package.json`.
- `.env.example` (Neon only) and `.env.local` (has `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`).
- Existing prompts (`implement-design-system.md`) for format and check conventions.
- `db/`, `neon.ts`, `index.ts` — legacy Neon/Drizzle leftovers, not part of this task.

## Decisions and assumptions
1. **Workspace structure — keep the current single-repo embedded Studio.** AGENTS.md mandates two standalone workspaces (`studio/` + `web/`), but the repo has evolved to a single Next.js app with the Studio embedded at `/studio` (committed design-system/auth work all lives here). Restructuring to two workspaces is a separate task; this prompt keeps the existing structure and flags the migration as a follow-up. The schema, structure, and query folders are organized so they can move wholesale into a standalone Studio later.
2. **Private dataset + server-only read token.** The read client reads the private dataset with `SANITY_API_READ_TOKEN` (non-`NEXT_PUBLIC`, so it never reaches the browser). `useCdn` is `false` when the token is present (token-authenticated datasets aren't served on CDN) and `true` otherwise. The token is optional at module load (no import-time throw) so dev builds don't crash before the token is set; fetch of private content simply requires it.
3. **`defineLive` passes `serverToken` only** (never `browserToken`), honoring "read token stays on the server". Server Components read via `sanityFetch`.
4. **Module is an embedded object inside course** (per AGENTS.md §8), not a document. Module and lesson numbers are derived from order, never stored.
5. **Portable Text only for lesson `notes`.** Lesson notes are rich text. Instructor `bio` and course/category descriptions stay plain `text` (per AGENTS.md, PTE is called out for lesson notes only; keep everything else lean).
6. **Field specifics** (AGENTS.md fixes names/relationships; I choose the rest):
   - `course`: title, slug, summary, coverImage (image + alt), level (`options.list` radio: beginner/intermediate/advanced), price (`number`), popular (boolean), studentCount (number), learningOutcomes (array of `learningOutcome` objects: icon string, title, description), instructor (reference), category (reference), modules (array of `module` objects).
   - `module` (object): title, summary, lessons (array of references to lesson).
   - `lesson`: title, slug, videoUrl (url), poster (image), duration (number, **seconds** — aligns with video timestamps; UI formats it), freePreview (boolean), studentCount (number), notes (array of `block`), keyPoints (array of string), proTip (text, optional), resources (array of `resource` objects: type string, title, description, url).
   - `learningOutcome` (object): icon (string, `options.list` of lowercase lucide icon names, e.g. zap/rocket/code/book/target/layers/trophy), title, description.
   - `resource` (object): type (string, `options.list`: link/document/video/download), title, description, url.
   - `instructor`: name, slug, photo (image), expertise (string), bio (text).
   - `category`: title, slug, description.
7. **Icons via `@sanity/icons`**, imported from subpaths (`@sanity/icons/Book`, `@sanity/icons/Play`, `@sanity/icons/User`, `@sanity/icons/Tag`) — root named imports were removed in v5.
8. **TypeGen enabled** (`sanity.cli.ts`), queries in `sanity/lib/queries/*.ts` using `defineQuery` from `next-sanity` (re-exported), generated `sanity.types.ts` committed at repo root (included by the existing tsconfig `**/*.ts`). Manual `npm run typegen` script since the embedded Studio can't hook `next dev`.
9. **Query projections only** — no `*[_type == ...]` document-dump. Reverse references use optimizable filters (`references(^._id)`, `instructor._ref == ^._id`). Lesson's course is derived by reverse reference; if a lesson is reused by multiple courses the first is returned (`[0]`) — documented, acceptable for now.
10. **Card fragment reuse** — one course-card fragment shared by catalog, featured, and instructor queries.

## Files to create/modify
Create:
- `sanity/schemaTypes/documents/course.ts`
- `sanity/schemaTypes/documents/lesson.ts`
- `sanity/schemaTypes/documents/instructor.ts`
- `sanity/schemaTypes/documents/category.ts`
- `sanity/schemaTypes/objects/module.ts`
- `sanity/schemaTypes/objects/learning-outcome.ts`
- `sanity/schemaTypes/objects/resource.ts`
- `sanity/lib/queries/fragments.ts`
- `sanity/lib/queries/catalog.ts`
- `sanity/lib/queries/course.ts`
- `sanity/lib/queries/lesson.ts`
- `sanity/lib/queries/instructor.ts`
- `sanity/lib/queries/category.ts`
- `sanity/lib/queries/index.ts`
- `sanity/lib/data.ts` (server-side fetch wrappers, `import 'server-only'`)

Modify:
- `sanity/schemaTypes/index.ts` — register all types
- `sanity/structure.ts` — grouped desk structure (Courses, Lessons | Taxonomy: Instructors, Categories)
- `sanity/lib/client.ts` — optional read token on the client, `useCdn: false` when token set
- `sanity/lib/live.ts` — pass `serverToken`
- `sanity.cli.ts` — add `typegen` config
- `package.json` — add `@sanity/icons` + `groq` as deps; add `"typegen": "sanity schemas extract --force && sanity typegen generate"`
- `.env.example` — canonical Sanity block (project id, dataset, api version, read token)
- `.env.local` — append `SANITY_API_READ_TOKEN=` (placeholder; user fills value)

Generated (committed):
- `schema.json` (extract output)
- `sanity.types.ts` (typegen output)

## Requirements
1. Schema strictly uses `defineType` / `defineField` / `defineArrayMember`, kebab-cased files, `defineArrayMember` for arrays, `_key` respected. Uses `@sanity/icons` for document types.
2. Validation: required titles, slugs; lessons `min(1)` in module; keyPoints `min(1)`; sensible `max` warnings on summary/descriptions. Slug validator ensures lowercase a-z0-9-hyphens.
3. Desk structure: replace the default `documentTypeListItems()` with a grouped list: Courses, Lessons, then a Taxonomy group with Instructors and Categories.
4. Read client: token read from `SANITY_API_READ_TOKEN` only (never `NEXT_PUBLIC_`), client config `useCdn` flips to `false` when the token exists, apiVersion from `sanity/env.ts`.
5. `defineLive` configured with `serverToken` only.
6. GROQ queries (all wrapped in `defineQuery`, unique names, project-only fields):
   - `CATALOG_QUERY` / `FEATURED_COURSES_QUERY` — course cards.
   - `COURSE_QUERY` (slug param) — full course incl. instructor, category, learningOutcomes, modules with expanded lessons.
   - `COURSE_SLUGS_QUERY` — for future static params.
   - `LESSON_QUERY` (slug param) — lesson + `notes` (PTE) + reverse-referenced course with instructor and full module/lesson structure for the sidebar.
   - `LESSON_SLUGS_QUERY`.
   - `INSTRUCTOR_QUERY` (slug param) — instructor + courses they teach (optimizable `instructor._ref == ^._id`).
   - `INSTRUCTOR_SLUGS_QUERY`.
   - `CATEGORIES_QUERY` — categories with course counts.
7. `sanity/lib/data.ts` — `import 'server-only'`; thin typed wrappers (`getCatalog`, `getCourseBySlug`, `getLessonBySlug`, `getInstructorBySlug`, `getCategories`) backing onto `sanityFetch`.
8. `sanity.types.ts` generated so `client.fetch`/`sanityFetch` results are typed.

## Security considerations
- Read token lives only in a non-`NEXT_PUBLIC` env var; never in the client bundle, never logged, never committed. `.env` files are gitignored; only `.env.example` is committed.
- Keep the write path out: no write client, no create/update/patch anywhere. This layer is read-only.
- `import 'server-only'` on `data.ts` so fetch wrappers can't be imported from client code.
- No secrets hardcoded; `.env.example` is the canonical list.

## Acceptance criteria
1. `/studio` renders a grouped desk (Courses, Lessons, Instructors, Categories) with icons.
2. An author can create an instructor, a category, lessons, and a course with modules referencing lessons; validation nudges (required fields, min lessons).
3. Course/module/lesson numbers are not stored anywhere in the schema.
4. Read client uses the token against the private dataset; token is never `NEXT_PUBLIC_`.
5. `npm run typegen` produces `sanity.types.ts` + `schema.json` with zero errors; queries are typed.
6. All queries project fields and expand references; no bare document returns; fragment reuse is evident.
7. `npm run lint` and `npm run build` pass.
8. No pages, video documents, search, ingestion, progress, or Clerk changes.

## Checks to run
```bash
npm run typegen
npm run lint
npm run build
npm run dev   # then open http://localhost:3000/studio
```
In Studio's Vision, run `*[_type == "course"]{ title, "slug": slug.current }` (or a variant of `CATALOG_QUERY`) against the dataset to confirm reads work.

## Manual test steps
1. `npm run dev` → open `http://localhost:3000/studio`.
2. Confirm desk groups and icons render.
3. Create one instructor, one category, 2–3 lessons (fill notes/keyPoints/resources; one with `freePreview`).
4. Create a course: set marketing fields, attach instructor + category, add 2 modules each referencing lessons.
5. In Vision run the catalog query and confirm nested instructor/category/module-lesson expansions return.
6. Confirm generated types compile into app code (no red squiggles on `sanityFetch`/`client.fetch`).

## Needs your attention (after approval)
- Add `SANITY_API_READ_TOKEN` to `.env.local` (create it in Sanity Manage) before content reads work; until then reads of the private dataset fail with 401.
- AGENTS.md specifies two standalone workspaces; this task keeps the current single-repo embedded Studio. Decide separately whether to migrate.