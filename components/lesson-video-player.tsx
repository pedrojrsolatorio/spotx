"use client"

import {
  type VideoAnalyticsContext,
  useLessonVideoAnalytics,
} from "@/lib/video-tracking"

function buildYouTubeEmbedUrl(
  videoId: string,
  startSeconds?: number,
): string {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    enablejsapi: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "",
  })
  if (startSeconds) params.set("start", String(startSeconds))
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function buildVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?autoplay=1`
}

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function parseVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

export interface LessonVideoPlayerProps {
  videoUrl: string
  startSeconds?: number
  tracking?: VideoAnalyticsContext
}

export function LessonVideoPlayer({
  videoUrl,
  startSeconds,
  tracking,
}: LessonVideoPlayerProps) {
  const ytId = parseYouTubeId(videoUrl)
  const vimeoId = parseVimeoId(videoUrl)

  const { iframeRef, onFrameLoad } = useLessonVideoAnalytics({
    videoUrl,
    startSeconds,
    context: tracking,
  })

  let embedUrl = ""
  if (ytId) {
    embedUrl = buildYouTubeEmbedUrl(ytId, startSeconds)
  } else if (vimeoId) {
    embedUrl = buildVimeoEmbedUrl(vimeoId)
  } else {
    embedUrl = videoUrl
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-neutral-900">
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Lesson video"
          onLoad={onFrameLoad}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-500">
          <p>No video available</p>
        </div>
      )}
    </div>
  )
}
