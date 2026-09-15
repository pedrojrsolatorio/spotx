# Implement Lesson Page

## Goal
Create the lesson page at `/lesson/[slug]` matching `design/spotx-lesson.png`. The page shows a video player, lesson notes, key points, pro tip, resources, and a sidebar with course/module navigation. Wired to seeded Sanity content.

## Design Analysis

The layout is two columns: a fixed left sidebar + main content area.

**Left sidebar:**
- Course card: cover image thumbnail, course title, progress bar (35% hardcoded), "Module X of Y" dropdown
- Expandable module list: each module shows title + expand/collapse chevron
- Expanded module shows lessons: number, title, duration, checkmark (completed), play icon (current/now playing)
- Active lesson highlighted in orange with "Now playing" subtitle

**Main content:**
- "Back to course" link with arrow
- "LESSON X.X" badge (orange)
- Lesson title with bookmark icon button
- Lesson description text
- Stats row: duration (formatted), level, student count
- Video row (two parts):
  - Left (~65%): Video embed player (YouTube/Vimeo/Bunny)
  - Right (~35%): Lesson info card (lesson label, "Video" badge, title, description, module label, duration, "Next Lesson" button)
- "Overview" section heading
- Lesson notes rendered as Portable Text
- "In this lesson you will:" key points list with green check icons
- "Pro Tip" box (orange background)
- "Resources" section with resource cards (type icon, title, description, external link icon)

## Data Model (from LESSON_QUERY)
- `lesson.title`, `lesson.slug`, `lesson.videoUrl`, `lesson.duration`, `lesson.keyPoints`, `lesson.proTip`, `lesson.notes` (Portable Text), `lesson.resources[]`, `lesson.studentCount`
- `lesson.course.title`, `lesson.course.slug`, `lesson.course.instructor`
- `lesson.course.modules[]` with `modules[].lessons[]` — used for sidebar navigation and deriving lesson label (e.g. "Lesson 5.1")

## Key Decisions
1. **Sidebar is a client component** — needs expand/collapse toggle state per module
2. **Video embed** — parse `videoUrl` to detect YouTube/Vimeo/Bunny, render appropriate `<iframe>` embed. YouTube: `https://www.youtube.com/embed/{ID}?start={seconds}&autoplay=1`
3. **Lesson label derivation** — iterate `course.modules` to find which module+lesson index the current lesson belongs to (e.g. module 5, lesson 1 → "Lesson 5.1")
4. **"Now playing" indicator** — pass current lesson slug to sidebar, highlight matching lesson
5. **Progress is hardcoded to 35%** — same as course page (needs progress tracking backend)
6. **Next Lesson** — derive from flat lesson list in course modules, link to next lesson slug
7. **Notes rendering** — use `@portabletext/react` (already a dependency)
8. **Duration format** — reuse the `formatDuration` helper from course-hero (seconds → "1h 28m")
9. **Level** — not in current LESSON_QUERY, need to add `level` to the course projection
10. **Bookmark** — presentational only, no backend

## Query Changes

### `sanity/lib/queries/lesson.ts` — LESSON_QUERY
Add `level` to the course projection:
```
"course": *[_type == "course" && references(^._id)][0]{
  _id,
  title,
  "slug": slug.current,
  level,          // <-- ADD THIS
  "instructor": instructor->{ ${instructorFragment} },
  modules[] { ... }
}
```

## Files to Create

### 1. `app/lesson/[slug]/page.tsx`
- Server component
- `params: Promise<{slug: string}>` (Next 16)
- `generateStaticParams` from `getLessonSlugs`
- `generateMetadata` from lesson title
- Fetch lesson via `getLessonBySlug`
- Derive: `moduleIndex`, `lessonIndex`, `currentModule`, `nextLesson`, `flatLessons`
- Two-column layout: sidebar + main content
- Call `notFound()` if no lesson

### 2. `components/lesson-sidebar.tsx` ("use client")
- Props: `course`, `currentLessonSlug`, `moduleIndex`, `lessonIndex`
- Course card: cover image, title, progress bar, module count
- Expandable modules: default-expand current module
- Each lesson row: number, title, duration, checkmark (all unchecked for now), play icon if current
- Uses `ChevronDown` from lucide for expand/collapse

### 3. `components/lesson-video-player.tsx`
- Props: `videoUrl`, `startSeconds?`
- Parse URL to detect provider (YouTube, Vimeo, Bunny)
- YouTube: `https://www.youtube.com/embed/{VIDEO_ID}`
- Vimeo: `https://player.vimeo.com/video/{VIDEO_ID}`
- Render `<iframe>` with responsive aspect ratio
- Pass `?start={startSeconds}` for YouTube seek

### 4. `components/lesson-hero.tsx`
- Props: `lesson`, `moduleIndex`, `lessonIndex`, `level`
- "Back to course" link
- "LESSON {moduleIndex}.{lessonIndex}" badge
- Title
- Bookmark button
- Description text (from course summary or lesson description — actually the design shows lesson-specific description; use course summary as fallback since lesson doesn't have its own description field)
- Stats row: duration, level, student count

### 5. `components/lesson-info-card.tsx`
- Props: `lesson`, `moduleIndex`, `lessonIndex`, `nextLessonSlug`, `courseSlug`
- Lesson label "Lesson X.X"
- "Video" badge
- Title
- Short description (course summary or lesson title context)
- Module label "Module {moduleIndex}"
- Duration
- "Next Lesson" button linking to next lesson

### 6. `components/lesson-key-points.tsx`
- Props: `keyPoints: string[]`
- Light bulb icon
- "In this lesson you will:" heading
- List of key points with green check circles

### 7. `components/lesson-pro-tip.tsx`
- Props: `proTip: string`
- Light bulb icon
- "Pro Tip" heading
- Orange background box with text

### 8. `components/lesson-resources.tsx`
- Props: `resources: { type, title, description, url }[]`
- "Resources" heading
- Grid of resource cards: type icon, title, description, external link icon

## Files to Modify

1. `sanity/lib/queries/lesson.ts` — add `level` to course projection
2. Run typegen after query change

## Requirements
- Video plays on the page via iframe embed (never sends user to provider)
- Sidebar highlights the current lesson with "Now playing"
- Expand/collapse modules in sidebar
- "Next Lesson" button navigates to next lesson
- "Back to course" links to `/course/{courseSlug}`
- Notes rendered via `@portabletext/react`
- Duration formatted as "Xh Ym"
- Responsive: sidebar collapses on mobile (stack columns)

## Security Considerations
- All data fetched server side via `getLessonBySlug`
- No tokens exposed to client
- Video embeds are provider iframes (sandboxed)
- No client-side Sanity access

## Acceptance Criteria
- `/lesson/{slug}` renders with video player, notes, key points, pro tip, resources
- Sidebar shows course modules with expand/collapse, highlights current lesson
- Video embed works (YouTube iframe with start parameter)
- "Next Lesson" button links to correct next lesson
- "Back to course" links to correct course page
- Typegen passes, lint 0 errors, scoped tsc clean

## Checks to Run
1. `npm run typegen` — 9 queries, 22 types
2. `npm run lint` — 0 errors
3. Scoped `tsc --noEmit` — clean
