import { auth, authConfigured } from "@/lib/auth/server";
import { getPostHogClient } from "@/lib/posthog-server";

type AuthRouteContext = {
  params: Promise<{ path: string[] }>;
};

const unconfigured = (...args: [Request, AuthRouteContext]) => {
  void args;
  return new Response("Authentication is not configured", { status: 503 });
};

const handler = authConfigured
  ? auth!.handler()
  : {
      GET: unconfigured,
      POST: unconfigured,
    };

export const GET = handler.GET;

export async function POST(request: Request, context: AuthRouteContext) {
  const startedAt = Date.now();
  const distinctId =
    request.headers.get("x-posthog-distinct-id") ?? crypto.randomUUID();
  const posthog = getPostHogClient();

  try {
    const response = await handler.POST(request, context);

    if (posthog) {
      posthog.capture({
        distinctId,
        event: "auth_request_completed",
        properties: {
          auth_path: new URL(request.url).pathname,
          duration_ms: Date.now() - startedAt,
          status_code: response.status,
          success: response.ok,
        },
      });
      await posthog.flush();
    }

    return response;
  } catch (error) {
    if (posthog) {
      posthog.captureException(error, distinctId, {
        auth_path: new URL(request.url).pathname,
      });
      await posthog.flush();
    }

    throw error;
  }
}