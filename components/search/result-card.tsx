"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { CheckCircle2, Clock, Film, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { LessonResult, SearchResult, VideoResult } from "@/lib/search/schema"

function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function CourseChip({ title }: { title: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-800 text-xs font-bold text-white">
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
  moduleTitle,
  lessonLabel,
  lessonTitle,
  description,
  meta,
  cta,
}: SharedProps & {
  badge: { label: string; variant: "video" | "lesson" }
  meta?: ReactNode
  cta: { label: string; href: string }
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-4">
        <CourseChip title={courseTitle} />
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>
      <p className="mb-2 text-sm text-neutral-500">
        {lessonLabel} in {moduleTitle}
      </p>
      <h2 className="mb-2 text-xl font-medium text-primary-500 font-poppins">
        {lessonTitle}
      </h2>
      <p className="mb-4 text-base text-neutral-700">{description}</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          {meta}
        </div>
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-accent/90"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  )
}

function LessonCard({ result }: { result: LessonResult }) {
  return (
    <CardShell
      courseTitle={result.courseTitle}
      moduleTitle={result.moduleTitle}
      lessonLabel={result.lessonLabel}
      lessonTitle={result.lessonTitle}
      description={result.description}
      badge={{ label: "Lesson", variant: "lesson" }}
      meta={
        result.keyPoints.length > 0 && (
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {result.keyPoints.slice(0, 2).map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-primary-accent" />
                {point}
              </span>
            ))}
          </span>
        )
      }
      cta={{ label: "Open lesson", href: `/lesson/${result.lessonSlug}` }}
    />
  )
}

function VideoCard({ result }: { result: VideoResult }) {
  return (
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
            <Film className="h-4.5 w-4.5" />
            {result.clipLength}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4.5 w-4.5" />
            Match at {formatSeconds(result.seconds)}
          </span>
        </>
      }
      cta={{
        label: `Watch from ${formatSeconds(result.seconds)}`,
        href: `/lesson/${result.lessonSlug}?start=${result.seconds}`,
      }}
    />
  )
}

export function ResultCard({ result }: { result: SearchResult }) {
  const isVideo = result.type === "video"
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {isVideo && result.thumbnailUrl && (
        <div className="relative aspect-video sm:w-56 sm:shrink-0 sm:aspect-auto overflow-hidden rounded-2xl bg-neutral-800">
          <img
            src={result.thumbnailUrl}
            alt={result.lessonTitle}
            className="h-full w-full object-cover"
          />
          <span className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
            <PlayCircle className="h-5 w-5 text-primary-accent" />
          </span>
        </div>
      )}
      {isVideo ? (
        <VideoCard result={result} />
      ) : (
        <LessonCard result={result} />
      )}
    </div>
  )
}