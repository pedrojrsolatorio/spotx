"use client"

import * as React from "react"
import posthog from "posthog-js"
import { cn } from "@/lib/utils"
import { ArrowRight, Clock, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { urlFor } from "@/sanity/lib/image"
import type { FEATURED_COURSES_QUERY_RESULT } from "@/sanity.types"

type SanityCourse = FEATURED_COURSES_QUERY_RESULT[number]

export interface AllCoursesProps extends React.HTMLAttributes<HTMLElement> {
  courses: SanityCourse[]
  showViewAll?: boolean
}

const AllCourses = React.forwardRef<HTMLElement, AllCoursesProps>(
  ({ className, courses, showViewAll = true, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8", className)}
      {...props}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-semibold text-primary-500 font-poppins">
              All Courses
            </h2>
            <div className="mt-3 h-1 w-16 bg-primary-accent" />
          </div>
          {showViewAll && (
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-base font-medium text-primary-accent hover:underline"
            >
              View all courses
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/course/${course.slug}`}
              onClick={() => {
                if (
                  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
                  process.env.NEXT_PUBLIC_POSTHOG_HOST
                ) {
                  posthog.capture("course_selected", {
                    course_id: course._id,
                    course_slug: course.slug,
                    level: course.level,
                    module_count: course.moduleCount,
                    lesson_count: course.lessonCount,
                  })
                }
              }}
            >
              <Card className="group h-full transition-shadow hover:shadow-lg cursor-pointer overflow-hidden rounded-2xl">
                <div className="relative h-56 overflow-hidden">
                  {course.coverImage?.asset?.url ? (
                    <img
                      src={urlFor(course.coverImage).width(600).height(300).url()}
                      alt={course.coverImage.alt || course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                      <span className="text-4xl font-bold text-white font-poppins">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {course.category && (
                    <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-500 shadow-sm backdrop-blur-sm">
                      {course.category.title}
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-primary-500 font-poppins mb-2 group-hover:text-primary-accent transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-base text-neutral-700 mb-4 line-clamp-2">
                    {course.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4.5 w-4.5" />
                      {course.level && course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4.5 w-4.5" />
                      {course.moduleCount} modules
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4.5 w-4.5" />
                      {course.lessonCount} lessons
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
)
AllCourses.displayName = "AllCourses"

export { AllCourses }
