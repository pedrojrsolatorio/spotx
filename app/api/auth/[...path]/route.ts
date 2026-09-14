import { auth, authConfigured } from "@/lib/auth/server";

const unconfigured = () =>
  new Response("Authentication is not configured", { status: 503 });

const handler = authConfigured
  ? auth!.handler()
  : {
      GET: unconfigured,
      POST: unconfigured,
    };

export const GET = handler.GET;
export const POST = handler.POST;