"use client"

import * as React from "react"
import { posthogCapture } from "@/lib/posthog-client"

export interface VideoAnalyticsContext {
  lessonSlug: string
  lessonTitle: string
  courseTitle: string
  courseSlug: string
  moduleLabel: string
  lessonLabel: string
}

type Provider = "youtube" | "vimeo" | "bunny" | "other"

const YOUTUBE_ORIGIN = "https://www.youtube.com"
const PROGRESS_INTERVAL_MS = 15_000
const COMPLETION_THRESHOLD = 0.95

function detectProvider(url: string): Provider {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube"
  if (/vimeo\.com/.test(url)) return "vimeo"
  if (/bunny\.net|mediadelivery\.net/.test(url)) return "bunny"
  return "other"
}

function extractVideoId(url: string, provider: Provider): string {
  if (provider === "youtube") {
    const patterns = [/[?&]v=([^&]+)/, /youtu\.be\/([^?]+)/, /embed\/([^?]+)/]
    for (const p of patterns) {
      const m = url.match(p)
      if (m) return m[1]
    }
  }
  if (provider === "vimeo") {
    const m = url.match(/vimeo\.com\/(\d+)/)
    if (m) return m[1]
  }
  return ""
}

type BaseProperties = {
  provider: Provider
  video_id: string
  lesson_slug: string
  lesson_title: string
  course_title: string
  course_slug: string
  module_label: string
  lesson_label: string
  start_seconds: number
}

function buildBase(
  provider: Provider,
  videoUrl: string,
  context: VideoAnalyticsContext,
  startSeconds: number,
): Record<string, unknown> {
  const base: BaseProperties = {
    provider,
    video_id: extractVideoId(videoUrl, provider),
    lesson_slug: context.lessonSlug,
    lesson_title: context.lessonTitle,
    course_title: context.courseTitle,
    course_slug: context.courseSlug,
    module_label: context.moduleLabel,
    lesson_label: context.lessonLabel,
    start_seconds: startSeconds,
  }
  return { ...base }
}

export interface UseLessonVideoAnalyticsOptions {
  videoUrl: string
  startSeconds?: number
  context?: VideoAnalyticsContext
}

export interface UseLessonVideoAnalyticsReturn {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  onFrameLoad: () => void
}

interface WatchState {
  started: boolean
  maxSeconds: number
  duration: number | null
  completed: boolean
  lastProgressLog: number
  nonYouTubeFired: boolean
}

export function useLessonVideoAnalytics({
  videoUrl,
  startSeconds = 0,
  context,
}: UseLessonVideoAnalyticsOptions): UseLessonVideoAnalyticsReturn {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  const videoUrlRef = React.useRef(videoUrl)
  const startSecondsRef = React.useRef(startSeconds)
  const contextRef = React.useRef(context)

  // Keep the refs in sync when the props change (the analytics effect below
  // runs once and reads these through the refs).
  React.useEffect(() => {
    videoUrlRef.current = videoUrl
    startSecondsRef.current = startSeconds
    contextRef.current = context
  })

  const widgetId = React.useRef<string | null>(null)

  const state = React.useRef<WatchState>({
    started: false,
    maxSeconds: 0,
    duration: null,
    completed: false,
    lastProgressLog: 0,
    nonYouTubeFired: false,
  })

  const logProgressRef = React.useRef((final = false) => {
    const currentContext = contextRef.current
    if (!currentContext) return
    const provider = detectProvider(videoUrlRef.current)
    const base = buildBase(
      provider,
      videoUrlRef.current,
      currentContext,
      startSecondsRef.current,
    )
    const s = state.current
    const now = Date.now()

    if (final || now - s.lastProgressLog >= PROGRESS_INTERVAL_MS) {
      const duration = s.duration
      const percent =
        duration && duration > 0
          ? Math.round((Math.min(s.maxSeconds, duration) / duration) * 100) /
            100
          : undefined

      posthogCapture("video_watch_progress", {
        ...base,
        current_seconds: Math.round(s.maxSeconds),
        percent_watched: percent,
        duration: duration ? Math.round(duration) : undefined,
      })

      if (percent !== undefined && percent >= COMPLETION_THRESHOLD && !s.completed) {
        s.completed = true
        posthogCapture("video_completed", {
          ...base,
          current_seconds: Math.round(s.maxSeconds),
          percent_watched: percent,
          duration: duration ? Math.round(duration) : undefined,
        })
      }

      s.lastProgressLog = now
    }
  })

  const onFrameLoad = React.useCallback(() => {
    const currentContext = contextRef.current
    if (!currentContext) return
    const s = state.current
    if (s.nonYouTubeFired) return
    const provider = detectProvider(videoUrlRef.current)
    if (provider === "youtube") return // handled via postMessage below
    s.nonYouTubeFired = true
    posthogCapture(
      "video_play",
      buildBase(provider, videoUrlRef.current, currentContext, startSecondsRef.current),
    )
  }, [])

  // YouTube postMessage widget protocol
  React.useEffect(() => {
    const rawUrl = videoUrlRef.current
    const provider = detectProvider(rawUrl)
    if (provider !== "youtube" || !contextRef.current) return

    const s = state.current
    if (widgetId.current === null) {
      widgetId.current = `spotx-${Math.random().toString(36).slice(2, 8)}`
    }
    const id = widgetId.current
    const frame = iframeRef.current
    const win = frame?.contentWindow

    if (!win) return

    const log = logProgressRef.current

    const post = (msg: Record<string, unknown>) => {
      try {
        win.postMessage(JSON.stringify(msg), YOUTUBE_ORIGIN)
      } catch {
        // Cross-origin error; should not happen with YouTube.
      }
    }

    const sendListening = () =>
      post({ event: "listening", id, channel: "widget" })

    const poll = () => {
      post({
        event: "command",
        func: "getCurrentTime",
        args: [],
        id,
        channel: "widget",
      })
      post({
        event: "command",
        func: "getDuration",
        args: [],
        id,
        channel: "widget",
      })
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== win) return

      let data: Record<string, unknown>
      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data)
        } catch {
          return
        }
      } else if (typeof event.data === "object" && event.data !== null) {
        data = event.data
      } else {
        return
      }

      if (data.id !== id) return

      // State change: info is a number (1 = playing, 2 = paused, 0 = unstarted)
      if (data.event === "onStateChange" || data.event === "initialDelivery") {
        const info = data.info as number | undefined
        if (info === 1 && !s.started) {
          s.started = true
          posthogCapture(
            "video_play",
            buildBase(
              provider,
              videoUrlRef.current,
              contextRef.current!,
              startSecondsRef.current,
            ),
          )
        }
      }

      if (data.event === "infoDelivery") {
        const info = data.info as Record<string, unknown> | undefined
        if (info) {
          if (typeof info.currentTime === "number")
            s.maxSeconds = Math.max(s.maxSeconds, info.currentTime)
          if (typeof info.duration === "number" && Number.isFinite(info.duration))
            s.duration = info.duration
        }
      }
    }

    const onLoad = () => {
      sendListening()
      poll()
    }

    window.addEventListener("message", handleMessage)
    // Initial + retry in case the iframe is already loaded
    sendListening()
    onLoad()
    const retryTimer = setTimeout(onLoad, 1000)
    const pollInterval = setInterval(poll, 5000)
    const progressInterval = setInterval(() => log(), PROGRESS_INTERVAL_MS)

    return () => {
      clearTimeout(retryTimer)
      clearInterval(pollInterval)
      clearInterval(progressInterval)
      window.removeEventListener("message", handleMessage)
      log(true)
    }
  }, [])

  return { iframeRef, onFrameLoad }
}