import { Clock, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { LESSON_QUERY_RESULT } from "@/sanity.types"

type Lesson = NonNullable<LESSON_QUERY_RESULT>

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

interface LessonInfoCardProps {
  lesson: Lesson
  moduleIndex: number
  lessonIndex: number
  nextLessonSlug: string | null
}

export function LessonInfoCard({ lesson, moduleIndex, lessonIndex, nextLessonSlug }: LessonInfoCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-100">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
        <span>Lesson {moduleIndex + 1}.{lessonIndex + 1}</span>
        <span className="rounded-full bg-primary-accent/10 px-2 py-0.5 text-[10px] font-semibold text-primary-accent">
          Video
        </span>
      </div>
      <h3 className="text-lg font-semibold text-primary-500 font-poppins mb-2">
        {lesson.title}
      </h3>
      {lesson.course?.summary && (
        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
          {lesson.course.summary}
        </p>
      )}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <BookOpen className="h-4.5 w-4.5" />
          <span>Module {moduleIndex + 1}</span>
        </div>
        {lesson.duration && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Clock className="h-4.5 w-4.5" />
            <span>{formatDuration(lesson.duration)}</span>
          </div>
        )}
      </div>
      {nextLessonSlug && (
        <Link
          href={`/lesson/${nextLessonSlug}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-accent/90"
        >
          Next Lesson
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      )}
    </div>
  )
}
