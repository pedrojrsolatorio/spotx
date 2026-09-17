"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { CheckCircle2, ExternalLink, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { posthogCapture } from "@/lib/posthog-client"
import type { LessonResult, SearchResult, VideoResult } from "@/lib/search/schema"

function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

const COURSE_COLORS: Record<string, string> = {
  N: "bg-indigo-700",
  R: "bg-cyan-600",
  J: "bg-yellow-500",
  n: "bg-neutral-800",
}

function getCourseColor(title: string): string {
  const first = title.charAt(0).toUpperCase()
  if (COURSE_COLORS[first]) return COURSE_COLORS[first]
  let hash = 0
  for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 55%, 45%)`
}

function CourseChip({ title }: { title: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-white ${getCourseColor(title)}`}
      >
        {title.charAt(0).toUpperCase()}
      </span>
      <span className="text-sm font-medium text-neutral-700">{title}</span>
    </span>
  )
}

interface SharedProps {
  courseTitle: string
  moduleTitle: string
  lessonLabel: string
  lessonTitle: string
  description: string
}

function CardShell({
  badge,
  courseTitle,
  lessonTitle,
  description,
  meta,
  cta,
}: SharedProps & {
  badge: { label: string; variant: "video" | "lesson" }
  meta?: ReactNode
  cta: { label: string; href: string; icon?: ReactNode; external?: boolean }
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <CourseChip title={courseTitle} />
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>
      <h2 className="mb-1.5 text-lg font-semibold text-primary-500 font-poppins leading-snug">
        {lessonTitle}
      </h2>
      <p className="mb-3 text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          {meta}
        </div>
        {cta.external ? (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent transition-colors hover:text-primary-accent/80"
          >
            {cta.label}
            <ExternalLink className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-neutral-50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-accent text-white">
              <Play className="h-3 w-3 fill-current" />
            </span>
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  )
}

function LessonCard({ result }: { result: LessonResult }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {result.keyPoints.length > 0 && (
        <div className="sm:w-44 sm:shrink-0">
          <ul className="space-y-1.5">
            {result.keyPoints.slice(0, 3).map((point: string) => (
              <li key={point} className="flex items-start gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <CardShell
        courseTitle={result.courseTitle}
        moduleTitle={result.moduleTitle}
        lessonLabel={result.lessonLabel}
        lessonTitle={result.lessonTitle}
        description={result.description}
        badge={{ label: "Lesson", variant: "lesson" }}
        meta={
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {result.moduleTitle}
          </span>
        }
        cta={{
          label: "View lesson",
          href: `/lesson/${result.lessonSlug}`,
          external: true,
        }}
      />
    </div>
  )
}

function VideoCard({ result }: { result: VideoResult }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {result.thumbnailUrl && (
        <Link
          href={`/lesson/${result.lessonSlug}?start=${result.seconds}`}
          className="group relative aspect-video sm:w-56 sm:shrink-0 overflow-hidden rounded-xl bg-neutral-800"
        >
          <img
            src={result.thumbnailUrl}
            alt={result.lessonTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
              <Play className="h-6 w-6 fill-primary-accent text-primary-accent" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatSeconds(result.seconds)}
          </span>
        </Link>
      )}
      <CardShell
        courseTitle={result.courseTitle}
        moduleTitle={result.moduleTitle}
        lessonLabel={result.lessonLabel}
        lessonTitle={result.lessonTitle}
        description={result.description}
        badge={{ label: "Video", variant: "video" }}
        meta={
          <>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {result.lessonLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {result.moduleTitle}
            </span>
          </>
        }
        cta={{
          label: `Watch from ${formatSeconds(result.seconds)}`,
          href: `/lesson/${result.lessonSlug}?start=${result.seconds}`,
        }}
      />
    </div>
  )
}

export function ResultCard({ result, position }: { result: SearchResult; position?: number }) {
  const trackOpen = () => {
    posthogCapture("search_result_opened", {
      result_type: result.type,
      course_title: result.courseTitle,
      course_slug: result.courseSlug,
      module_label: result.moduleLabel,
      lesson_label: result.lessonLabel,
      lesson_slug: result.lessonSlug,
      ...(result.type === "video" ? { seconds: result.seconds } : {}),
      ...(typeof position === "number" ? { result_position: position } : {}),
    })
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md" onClickCapture={trackOpen}>
      {result.type === "video" ? (
        <VideoCard result={result} />
      ) : (
        <LessonCard result={result} />
      )}
    </div>
  )
}