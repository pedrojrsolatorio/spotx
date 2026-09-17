"use client"

import * as React from "react"
import { posthogCapture } from "@/lib/posthog-client"

interface LessonTrackerProps {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  moduleLabel: string
  lessonLabel: string
  freePreview: boolean
  startSeconds: number
}

export function LessonTracker({
  courseSlug,
  courseTitle,
  lessonSlug,
  moduleLabel,
  lessonLabel,
  freePreview,
  startSeconds,
}: LessonTrackerProps) {
  React.useEffect(() => {
    posthogCapture("lesson_viewed", {
      course_slug: courseSlug,
      course_title: courseTitle,
      lesson_slug: lessonSlug,
      module_label: moduleLabel,
      lesson_label: lessonLabel,
      free_preview: freePreview,
      start_seconds: startSeconds,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}