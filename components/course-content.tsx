"use client"

import * as React from "react"
import { List, ChevronDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { COURSE_QUERY_RESULT } from "@/sanity.types"

type Course = NonNullable<COURSE_QUERY_RESULT>
type ModuleItem = NonNullable<Course["modules"]>[number]
type LessonItem = NonNullable<ModuleItem["lessons"]>[number]

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

function getModuleDuration(lessons: ModuleItem["lessons"]): number {
  if (!lessons) return 0
  return lessons.reduce((sum: number, l: LessonItem) => sum + (l.duration ?? 0), 0)
}

const VISIBLE_COUNT = 6

interface CourseContentProps {
  modules: Course["modules"]
  totalDuration: number
  moduleCount: number
}

export function CourseContent({ modules, totalDuration, moduleCount }: CourseContentProps) {
  const [expanded, setExpanded] = React.useState(false)
  const allModules = modules ?? []
  const visible = expanded ? allModules : allModules.slice(0, VISIBLE_COUNT)
  const hasMore = allModules.length > VISIBLE_COUNT

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-accent/10">
            <List className="h-5 w-5 text-primary-accent" />
          </div>
          <h2 className="text-heading-1 font-bold text-primary-500 font-poppins">
            Course Content
          </h2>
        </div>
        <div className="flex items-center gap-3 text-body text-neutral-500">
          <span>{moduleCount} modules</span>
          <span className="text-neutral-300">•</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((mod, index) => (
          <ModuleCard key={mod._key} module_={mod} index={index + 1} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            {expanded ? "Show fewer modules" : `View all ${allModules.length} modules`}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}
    </section>
  )
}

function ModuleCard({ module_, index }: { module_: ModuleItem; index: number }) {
  const duration = getModuleDuration(module_.lessons)
  const lessonCount = module_.lessons?.length ?? 0

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-accent/10 text-body-large font-bold text-primary-accent font-poppins">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-large font-semibold text-primary-500 font-poppins">
            {module_.title}
          </h3>
          {module_.summary && (
            <p className="mt-1 text-body leading-body text-neutral-500">
              {module_.summary}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-small text-neutral-500">
            <span>{lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
