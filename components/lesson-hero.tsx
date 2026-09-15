import { ArrowLeft, Bookmark, Clock, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import type { LESSON_QUERY_RESULT } from "@/sanity.types"

type Lesson = NonNullable<LESSON_QUERY_RESULT>

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

interface LessonHeroProps {
  lesson: Lesson
  moduleIndex: number
  lessonIndex: number
}

export function LessonHero({ lesson, moduleIndex, lessonIndex }: LessonHeroProps) {
  return (
    <div className="space-y-4">
      <Link
        href={`/course/${lesson.course?.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
        Back to course
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className="inline-block rounded-full bg-primary-accent/10 px-3 py-1 text-xs font-semibold text-primary-accent">
            LESSON {moduleIndex + 1}.{lessonIndex + 1}
          </span>
          <h1 className="text-3xl font-bold text-primary-500 font-poppins leading-tight lg:text-4xl">
            {lesson.title}
          </h1>
          {lesson.course?.summary && (
            <p className="max-w-2xl text-body leading-body text-neutral-700">
              {lesson.course.summary}
            </p>
          )}
        </div>
        <button className="shrink-0 rounded-lg border border-neutral-200 p-2.5 text-neutral-400 transition-colors hover:text-primary-accent hover:border-primary-accent/30">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-5 text-body text-neutral-500">
        {lesson.duration && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4.5 w-4.5" />
            {formatDuration(lesson.duration)}
          </span>
        )}
        {lesson.course?.level && (
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-4.5 w-4.5" />
            {lesson.course.level.charAt(0).toUpperCase() + lesson.course.level.slice(1)}
          </span>
        )}
        {lesson.studentCount && (
          <span className="flex items-center gap-1.5">
            <Users className="h-4.5 w-4.5" />
            {lesson.studentCount.toLocaleString()} students
          </span>
        )}
      </div>
    </div>
  )
}
