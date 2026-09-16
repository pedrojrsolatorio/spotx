"use client";

import posthog from "posthog-js";

export function isPostHogConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );
}

export function posthogCapture(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!isPostHogConfigured()) return;
  posthog.capture(event, properties);
}

export function getClientDistinctHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!isPostHogConfigured()) return headers;

  try {
    headers["x-posthog-distinct-id"] = posthog.get_distinct_id();
    const sessionId = posthog.get_session_id();
    if (sessionId) headers["x-posthog-session-id"] = sessionId;
  } catch {
    // SDK may not be ready; the server falls back to a random UUID.
  }

  return headers;
}