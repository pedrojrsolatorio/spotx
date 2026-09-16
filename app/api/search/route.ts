import { google } from "@ai-sdk/google";
import { generateText, Output, stepCountIs } from "ai";

import { SEARCH_SYSTEM_PROMPT } from "@/lib/search/system-prompt";
import { createSearchContext } from "@/lib/search/sanity-context";
import { searchResponseSchema } from "@/lib/search/schema";
import { getPostHogClient } from "@/lib/posthog-server";

const DEFAULT_MODEL = "gemini-2.5-pro";
const MAX_STEPS = 20;
const MAX_QUERY_LENGTH = 200;

function buildSystemPrompt(initialContext: string | null): string {
  return `
${SEARCH_SYSTEM_PROMPT}
${
  initialContext
    ? `\n# Data reference\n\nUse this to understand what's in the dataset and write better queries.\n\n${initialContext}`
    : ""
}`.trim();
}

export async function GET(req: Request) {
  const query = (new URL(req.url).searchParams.get("q") ?? "")
    .trim()
    .slice(0, MAX_QUERY_LENGTH);

  if (!query) {
    return Response.json({ error: "Missing or empty query" }, { status: 400 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set" },
      { status: 500 },
    );
  }

  const startedAt = Date.now();
  const distinctId =
    req.headers.get("x-posthog-distinct-id") ?? crypto.randomUUID();
  const posthog = getPostHogClient();

  let searchContext: Awaited<ReturnType<typeof createSearchContext>> | null = null;

  try {
    searchContext = await createSearchContext();

    if (!process.env.SANITY_CONTEXT_MCP_URL && !process.env.SANITY_CONTEXT_SLUG) {
      console.info(
        "Using the Sanity Context base URL (no context document). Set SANITY_CONTEXT_SLUG to apply a Context document.",
      );
    }

    const result = await generateText({
      model: google(process.env.SEARCH_MODEL || DEFAULT_MODEL),
      system: buildSystemPrompt(searchContext.initialContext),
      prompt: `Search query: ${query}`,
      tools: searchContext.tools,
      stopWhen: stepCountIs(MAX_STEPS),
      maxOutputTokens: 8192,
      output: Output.object({
        schema: searchResponseSchema,
        name: "SearchResponse",
      }),
    });

    await searchContext.mcpClient.close();

    if (posthog) {
      posthog.capture({
        distinctId,
        event: "search_performed",
        properties: {
          query,
          result_count: result.output.count,
          course_count: result.output.courseCount,
          duration_ms: Date.now() - startedAt,
          model: process.env.SEARCH_MODEL || DEFAULT_MODEL,
          success: true,
        },
      });
      await posthog.flush();
    }

    return Response.json(result.output);
  } catch (error) {
    await searchContext?.mcpClient.close();

    console.error("Search failed:", error);

    if (posthog) {
      posthog.capture({
        distinctId,
        event: "search_failed",
        properties: {
          query,
          duration_ms: Date.now() - startedAt,
        },
      });
      posthog.captureException(error, distinctId, { query });
      await posthog.flush();
    }

    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}