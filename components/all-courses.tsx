import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Clock, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: string
  modules: number
  icon: string
  color: string
}

export interface AllCoursesProps extends React.HTMLAttributes<HTMLElement> {
  courses: Course[]
}

const AllCourses = React.forwardRef<HTMLElement, AllCoursesProps>(
  ({ className, courses, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("bg-white px-8 py-16", className)}
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
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-base font-medium text-primary-accent hover:underline"
          >
            View all courses
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="group h-full transition-shadow hover:shadow-lg cursor-pointer overflow-hidden rounded-2xl">
                <div className="relative h-48 overflow-hidden">
                  {/* Background with diagonal split */}
                  <div className={cn("absolute inset-0", course.color)}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <polygon points="0,0 400,0 400,200 0,200" fill="currentColor"/>
                      <polygon points="280,0 400,0 400,200 160,200" fill="white" fillOpacity="0.1"/>
                      <polygon points="320,0 400,0 400,80" fill="#FC563C" fillOpacity="0.8"/>
                    </svg>
                  </div>
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <span className="text-4xl font-bold text-white">
                        {course.icon}
                      </span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-primary-500 font-poppins mb-2 group-hover:text-primary-accent transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-base text-neutral-700 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {course.modules} modules
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
