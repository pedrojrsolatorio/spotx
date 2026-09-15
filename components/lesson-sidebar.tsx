"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Play, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import type { LESSON_QUERY_RESULT } from "@/sanity.types"

type Course = NonNullable<LESSON_QUERY_RESULT>["course"]

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

interface LessonSidebarProps {
  course: Course
  currentLessonSlug: string
  moduleIndex: number
  lessonIndex: number
}

export function LessonSidebar({ course, currentLessonSlug, moduleIndex, lessonIndex }: LessonSidebarProps) {
  const [expandedModules, setExpandedModules] = React.useState<Set<number>>(
    new Set([moduleIndex])
  )

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  if (!course) return null

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-28 space-y-4">
        <Link href={`/course/${course.slug}`} className="block">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                <span className="flex h-full w-full items-center justify-center text-lg font-bold text-neutral-600 font-poppins">
                  {course.title.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-primary-500 font-poppins truncate">
                  {course.title}
                </h3>
                <p className="text-xs text-neutral-500">35% complete</p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-primary-accent" style={{ width: "35%" }} />
            </div>
          </div>
        </Link>

        <div className="rounded-2xl bg-white shadow-sm border border-neutral-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-700">
              Module {moduleIndex + 1} of {course.modules?.length ?? 0}
            </p>
          </div>
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {course.modules?.map((mod, mIdx) => {
              const isExpanded = expandedModules.has(mIdx)
              const isCurrentModule = mIdx === moduleIndex

              return (
                <div key={mod._key}>
                  <button
                    onClick={() => toggleModule(mIdx)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
                      isCurrentModule ? "bg-primary-accent/5" : "hover:bg-neutral-50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium truncate",
                      isCurrentModule ? "text-primary-accent" : "text-neutral-700"
                    )}>
                      {mod.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4.5 w-4.5 shrink-0 text-neutral-400 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-neutral-50">
                      {mod.lessons?.map((lesson, lIdx) => {
                        const isCurrent = lesson.slug === currentLessonSlug

                        return (
                          <Link
                            key={lesson._id}
                            href={`/lesson/${lesson.slug}`}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                              isCurrent
                                ? "bg-primary-accent/5 border-l-2 border-primary-accent"
                                : "hover:bg-neutral-50 border-l-2 border-transparent"
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-500">
                              {lIdx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className={cn(
                                "text-sm truncate",
                                isCurrent ? "font-medium text-primary-accent" : "text-neutral-700"
                              )}>
                                {lesson.title}
                              </p>
                              {isCurrent ? (
                                <p className="text-xs text-primary-accent">Now playing</p>
                              ) : (
                                <p className="text-xs text-neutral-400">
                                  {lesson.duration ? formatDuration(lesson.duration) : ""}
                                </p>
                              )}
                            </div>
                            {isCurrent ? (
                              <Play className="h-4.5 w-4.5 shrink-0 text-primary-accent fill-primary-accent" />
                            ) : (
                              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-neutral-300" />
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
