export interface RateLimitWindow {
  max: number;
  windowMs: number;
}

export type RateLimitResult =
  | { limited: false }
  | { limited: true; retryAfterMs: number };

export type RateLimitCheck = (
  key: string,
  windows: readonly RateLimitWindow[],
) => RateLimitResult;

// In-memory sliding-window limiter. State is per module instance, so on a
// serverless host the limit is enforced per warm instance, not globally.
// Fine for a single-instance deployment; swap the store if you need
// distributed limiting.
export function createSlidingWindowLimiter(
  now: () => number = Date.now,
): RateLimitCheck {
  const hits = new Map<string, number[]>();

  return (key, windows) => {
    const current = now();
    const largestWindow = Math.max(...windows.map((w) => w.windowMs));
    const cutoff = current - largestWindow;

    const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);

    for (const { max, windowMs } of windows) {
      const within = recent.filter((t) => current - t < windowMs);
      if (within.length >= max) {
        const oldest = Math.min(...within);
        return {
          limited: true,
          retryAfterMs: Math.max(1, windowMs - (current - oldest)),
        };
      }
    }

    recent.push(current);
    hits.set(key, recent);
    return { limited: false };
  };
}

export function getRateLimitIdentity(request: Request): string {
  const distinctId = request.headers.get("x-posthog-distinct-id")?.trim();
  if (distinctId) return `user:${distinctId}`;
  const forwarded = request.headers.get("x-forwarded-for")?.trim();
  if (forwarded) return `ip:${forwarded.split(",")[0]!.trim()}`;
  return "anonymous";
}

const SEARCH_LIMITS: readonly RateLimitWindow[] = [
  { max: 10, windowMs: 60_000 },
  { max: 50, windowMs: 3_600_000 },
];

const searchLimiter = createSlidingWindowLimiter();

export function checkSearchRateLimit(request: Request): Response | null {
  const result = searchLimiter(getRateLimitIdentity(request), SEARCH_LIMITS);
  if (!result.limited) return null;

  return Response.json(
    { error: "Rate limit exceeded. Try again in a moment." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)),
      },
    },
  );
}