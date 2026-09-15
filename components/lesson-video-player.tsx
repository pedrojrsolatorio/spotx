"use client"

import { cn } from "@/lib/utils"

interface LessonVideoPlayerProps {
  videoUrl: string
  startSeconds?: number
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

export function LessonVideoPlayer({ videoUrl, startSeconds }: LessonVideoPlayerProps) {
  const ytId = parseYouTubeId(videoUrl)
  const vimeoId = parseVimeoId(videoUrl)

  let embedUrl = ""
  if (ytId) {
    const params = startSeconds ? `?start=${startSeconds}` : ""
    embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0${startSeconds ? `&start=${startSeconds}` : ""}`
  } else if (vimeoId) {
    embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
  } else {
    embedUrl = videoUrl
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-neutral-900">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Lesson video"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-500">
          <p>No video available</p>
        </div>
      )}
    </div>
  )
}
