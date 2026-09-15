import { createMCPClient, type MCPClient } from "@ai-sdk/mcp";

import { dataset, projectId } from "@/sanity/env";

const BASE_URL = "https://api.sanity.io/v2026-03-03/context/mcp";
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedInitialContext: string | null = null;
let cacheTimestamp = 0;

export function sanityContextUrl(): string {
  if (process.env.SANITY_CONTEXT_MCP_URL) {
    return process.env.SANITY_CONTEXT_MCP_URL;
  }
  const slug = process.env.SANITY_CONTEXT_SLUG;
  return [
    BASE_URL,
    projectId,
    dataset,
    ...(slug ? [slug] : []),
  ].join("/");
}

function initialContextUrl(mcpUrl: string): string {
  const url = new URL(mcpUrl);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/initial-context`;
  return url.toString();
}

// Slow on cold start; subsequent calls return the cached result.
async function fetchInitialContext(): Promise<string | null> {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) return null;

  const isStale = Date.now() - cacheTimestamp > CACHE_TTL_MS;
  const fetchPromise = isStale
    ? fetch(initialContextUrl(sanityContextUrl()), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (res.ok) {
            cachedInitialContext = await res.text();
            cacheTimestamp = Date.now();
          }
        })
        .catch(() => {})
    : null;

  if (!cachedInitialContext) await fetchPromise;

  return cachedInitialContext;
}

export interface SearchContext {
  mcpClient: MCPClient;
  tools: Awaited<ReturnType<MCPClient["tools"]>>;
  initialContext: string | null;
}

export async function createSearchContext(): Promise<SearchContext> {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_READ_TOKEN is not set");
  }

  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: sanityContextUrl(),
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  try {
    const [allMcpTools, initialContext] = await Promise.all([
      mcpClient.tools(),
      fetchInitialContext(),
    ]);

    // Initial context is already in the system prompt — drop the redundant tool.
    const { initial_context: _initialContext, ...tools } = allMcpTools;
    void _initialContext;

    return { mcpClient, tools, initialContext };
  } catch (error) {
    await mcpClient.close();
    throw error;
  }
}