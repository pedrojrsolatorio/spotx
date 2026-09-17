import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonHero } from "@/components/lesson-hero"
import { LessonVideoPlayer } from "@/components/lesson-video-player"
import { LessonInfoCard } from "@/components/lesson-info-card"
import { LessonKeyPoints } from "@/components/lesson-key-points"
import { LessonProTip } from "@/components/lesson-pro-tip"
import { LessonResources } from "@/components/lesson-resources"
import { LessonTracker } from "@/components/lesson-tracker"
import { getLessonBySlug, getLessonSlugs } from "@/sanity/lib/data"

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const slugs = await getLessonSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const lesson = await getLessonBySlug(slug)
  if (!lesson) return { title: "Lesson Not Found" }
  return {
    title: `${lesson.title} | SpotX`,
    description: lesson.course?.summary ?? `Learn ${lesson.title} on SpotX`,
  }
}

function findLessonPosition(
  modules: Array<{
    _key: string
    title: string
    lessons: Array<{ _id: string; slug: string }> | null
  }> | null,
  currentSlug: string
): { moduleIndex: number; lessonIndex: number } | null {
  if (!modules) return null
  for (let m = 0; m < modules.length; m++) {
    const lessons = modules[m].lessons
    if (!lessons) continue
    for (let l = 0; l < lessons.length; l++) {
      if (lessons[l].slug === currentSlug) {
        return { moduleIndex: m, lessonIndex: l }
      }
    }
  }
  return null
}

function getNextLessonSlug(
  modules: Array<{
    _key: string
    lessons: Array<{ slug: string }> | null
  }> | null,
  moduleIndex: number,
  lessonIndex: number
): string | null {
  if (!modules) return null
  const currentModule = modules[moduleIndex]
  if (!currentModule?.lessons) return null
  if (lessonIndex + 1 < currentModule.lessons.length) {
    return currentModule.lessons[lessonIndex + 1].slug
  }
  for (let m = moduleIndex + 1; m < modules.length; m++) {
    const lessons = modules[m].lessons
    if (lessons && lessons.length > 0) {
      return lessons[0].slug
    }
  }
  return null
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Promise<{ start?: string }>
}) {
  const { slug } = await params
  const { start } = await searchParams
  const lesson = await getLessonBySlug(slug)

  if (!lesson || !lesson.course) notFound()

  const position = findLessonPosition(lesson.course.modules, slug)
  if (!position) notFound()

  const { moduleIndex, lessonIndex } = position
  const nextLessonSlug = getNextLessonSlug(lesson.course.modules, moduleIndex, lessonIndex)
  const startSeconds = start ? parseInt(start, 10) : undefined
  const moduleLabel = `Module ${moduleIndex + 1}`
  const lessonLabel = `Lesson ${moduleIndex + 1}.${lessonIndex + 1}`

  return (
    <div className="min-h-screen bg-primary-100">
      <Navigation activeRoute="courses" />
      <main className="pt-28 pb-16 px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col lg:flex-row gap-8">
            <LessonSidebar
              course={lesson.course}
              currentLessonSlug={slug}
              moduleIndex={moduleIndex}
              lessonIndex={lessonIndex}
            />

            <div className="flex-1 min-w-0 space-y-8">
              <LessonHero
                lesson={lesson}
                moduleIndex={moduleIndex}
                lessonIndex={lessonIndex}
              />

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                  <LessonVideoPlayer
                    videoUrl={lesson.videoUrl}
                    startSeconds={startSeconds}
                    tracking={{
                      lessonSlug: slug,
                      lessonTitle: lesson.title,
                      courseTitle: lesson.course.title,
                      courseSlug: lesson.course.slug!,
                      moduleLabel,
                      lessonLabel,
                    }}
                  />
                </div>
                <div className="w-full lg:w-72 shrink-0">
                  <LessonInfoCard
                    lesson={lesson}
                    moduleIndex={moduleIndex}
                    lessonIndex={lessonIndex}
                    nextLessonSlug={nextLessonSlug}
                  />
                </div>
              </div>

              <LessonTracker
                courseSlug={lesson.course.slug!}
                courseTitle={lesson.course.title}
                lessonSlug={slug}
                moduleLabel={moduleLabel}
                lessonLabel={lessonLabel}
                freePreview={lesson.freePreview ?? false}
                startSeconds={startSeconds ?? 0}
              />

              {lesson.notes && (
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
                  <h2 className="text-xl font-bold text-primary-500 font-poppins mb-4">
                    Overview
                  </h2>
                  <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-neutral-700">
                    <PortableText value={lesson.notes} />
                  </div>
                </div>
              )}

              {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                <LessonKeyPoints keyPoints={lesson.keyPoints} />
              )}

              {lesson.proTip && (
                <LessonProTip proTip={lesson.proTip} />
              )}

              {lesson.resources && lesson.resources.length > 0 && (
                <LessonResources resources={lesson.resources} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
