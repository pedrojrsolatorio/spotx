import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { CourseHero } from "@/components/course-hero"
import { CourseLearningOutcomes } from "@/components/course-learning-outcomes"
import { CourseContent } from "@/components/course-content"
import { CourseSidebar } from "@/components/course-sidebar"
import { CourseNextStep } from "@/components/course-next-step"
import { getCourseBySlug, getCourseSlugs } from "@/sanity/lib/data"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const courses = await getCourseSlugs()
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return { title: "Course Not Found" }
  return {
    title: `${course.title} | SpotX`,
    description: course.summary,
  }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) notFound()

  const totalDuration = course.modules?.reduce(
    (sum, mod) => sum + (mod.lessons?.reduce((s, l) => s + (l.duration ?? 0), 0) ?? 0),
    0,
  ) ?? 0

  const moduleCount = course.modules?.length ?? 0
  const lessonCount = course.modules?.reduce((sum, mod) => sum + (mod.lessons?.length ?? 0), 0) ?? 0

  const firstLessonSlug = course.modules?.[0]?.lessons?.[0]?.slug ?? null

  return (
    <div className="min-h-screen bg-primary-100">
      <Navigation activeRoute="courses" />

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <CourseHero
              course={course}
              totalDuration={totalDuration}
              moduleCount={moduleCount}
              lessonCount={lessonCount}
            />

            <CourseLearningOutcomes learningOutcomes={course.learningOutcomes} />

            <CourseContent
              modules={course.modules}
              totalDuration={totalDuration}
              moduleCount={moduleCount}
            />

            <CourseNextStep courseSlug={course.slug} firstLessonSlug={firstLessonSlug} />
          </div>

          <aside>
            <CourseSidebar
              totalDuration={totalDuration}
              moduleCount={moduleCount}
              studentCount={course.studentCount}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
