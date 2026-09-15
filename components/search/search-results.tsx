"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react"
import posthog from "posthog-js"
import { cn } from "@/lib/utils"
import { ResultCard } from "@/components/search/result-card"
import type { SearchResponse } from "@/lib/search/schema"

type SortMode = "relevant" | "course"

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "relevant", label: "Most relevant" },
  { value: "course", label: "By course" },
]

export interface SearchResultsProps {
  query: string
}

const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
)

export function SearchResults({ query }: SearchResultsProps) {
  return <SearchResultsPanel key={query} query={query} />
}

function SearchResultsPanel({ query }: SearchResultsProps) {
  const router = useRouter()
  const [draft, setDraft] = React.useState(query)
  const [data, setData] = React.useState<SearchResponse | null>(null)
  const [loading, setLoading] = React.useState(Boolean(query))
  const [error, setError] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState<SortMode>("relevant")

  React.useEffect(() => {
    if (!query) return

    let cancelled = false

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(
            (body as { error?: string } | null)?.error ?? "Search failed",
          )
        }
        return res.json() as Promise<SearchResponse>
      })
      .then((result) => {
        if (cancelled) return
        setData(result)
        if (posthogConfigured) {
          posthog.capture("search_performed", {
            query: result.query,
            result_count: result.count,
            course_count: result.courseCount,
          })
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message ?? "Search failed")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  const results = React.useMemo(() => {
    if (!data) return []
    const list = [...data.results]
    if (sort === "course") {
      list.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle))
    }
    return list
  }, [data, sort])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = draft.trim()
    if (!next) return
    if (posthogConfigured) {
      posthog.capture("search_started", { query: next })
    }
    router.push(`/search?q=${encodeURIComponent(next)}`)
  }

  return (
    <section className="px-8">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-primary-500 font-poppins mb-2">
            Search your learning
          </h1>
          <div className="mt-3 h-1 w-16 bg-primary-accent" />
        </div>

        <form
          onSubmit={submit}
          className="mb-10 flex items-center rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm"
        >
          <Search className="ml-3 h-5 w-5 text-neutral-400" />
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask anything about your learning..."
            className="flex-1 border-0 bg-transparent px-4 py-3 text-base placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-accent/90"
          >
            <Search className="h-4.5 w-4.5" />
            Search
          </button>
        </form>

        {!query ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-8 py-16 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-neutral-300" />
            <p className="text-lg font-medium text-primary-500 mb-2">
              Ask a question in plain English
            </p>
            <p className="text-neutral-600">
              Try something like &quot;caching and revalidation&quot; or
              &quot;closures in JavaScript&quot;.
            </p>
          </div>
        ) : loading ? (
          <div className="space-y-6" aria-live="polite" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <div className="mb-3 h-4 w-1/3 rounded bg-neutral-200" />
                <div className="mb-2 h-6 w-2/3 rounded bg-neutral-200" />
                <div className="h-4 w-full rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-10">
            <h2 className="text-lg font-medium text-red-700 mb-2">
              Search is unavailable right now
            </h2>
            <p className="text-red-600/80 mb-4">{error}</p>
            <p className="text-sm text-neutral-600">
              Check that the Sanity Context MCP URL, the read token, and the
              model API key are configured and that the Studio is deployed.
            </p>
          </div>
        ) : data && data.count === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-8 py-16 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-neutral-300" />
            <h2 className="text-xl font-medium text-primary-500 mb-2">
              No results for &quot;{query}&quot;
            </h2>
            <p className="text-neutral-600 mb-6">
              We could not find a match. Browse the full catalog instead.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-accent/90"
            >
              Explore Courses
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        ) : data ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-base text-neutral-700">
                Found{" "}
                <span className="font-medium text-primary-500">
                  {data.count} results
                </span>{" "}
                across{" "}
                <span className="font-medium text-primary-500">
                  {data.courseCount} courses
                </span>{" "}
                for &quot;{query}&quot;
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-neutral-400" />
                <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSort(option.value)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                        sort === option.value
                          ? "bg-primary-accent text-white"
                          : "text-neutral-600 hover:text-primary-accent",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {results.map((result) => (
                <ResultCard
                  key={
                    result.type === "video"
                      ? `video:${result.lessonSlug}:${result.seconds}`
                      : `lesson:${result.lessonSlug}`
                  }
                  result={result}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}