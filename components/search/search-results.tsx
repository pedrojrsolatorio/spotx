"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react"
import {
  getClientDistinctHeaders,
  posthogCapture,
} from "@/lib/posthog-client"
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
  const [sortOpen, setSortOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const isMac = React.useSyncExternalStore(
    () => () => {},
    () => /mac/i.test(navigator.userAgent),
    () => false,
  )

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (!mod || e.key.toLowerCase() !== "k") return
      e.preventDefault()
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isMac])

  React.useEffect(() => {
    if (!query) return

    let cancelled = false

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      headers: { ...getClientDistinctHeaders() },
    })
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
    posthogCapture("search_started", { query: next })
    router.push(`/search?q=${encodeURIComponent(next)}`)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-accent">
                Search Results
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold text-primary-500 font-poppins">
              Results for{" "}
              <span className="text-primary-accent italic">
                &ldquo;{query}&rdquo;
              </span>
            </h1>
            {data && (
              <p className="mt-3 text-base text-neutral-600">
                Found{" "}
                <span className="font-semibold text-primary-500">
                  {data.count} results
                </span>{" "}
                across{" "}
                <span className="font-semibold text-primary-500">
                  {data.courseCount} courses
                </span>
              </p>
            )}
          </div>

          <form onSubmit={submit} className="mt-2 md:mt-8">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
              <Search className="h-5 w-5 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search courses..."
                className="w-full border-0 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none sm:w-48 lg:w-64"
              />
              <kbd className="hidden rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 sm:inline">
                {isMac ? "⌘K" : "Ctrl+K"}
              </kbd>
            </div>
          </form>
        </div>

        {!query ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-4 py-10 text-center sm:px-6 sm:py-16 lg:px-8">
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
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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
          <>
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-4 py-10 text-center sm:px-6 sm:py-16 lg:px-8">
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
            <BrowseAllCoursesCTA />
          </>
        ) : data ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-800">
                {data.count} results
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
                  {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                  <svg
                    className={cn(
                      "h-4 w-4 text-neutral-400 transition-transform",
                      sortOpen && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {sortOpen && (
                  <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSort(option.value)
                          setSortOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-center px-4 py-2 text-left text-sm transition-colors",
                          sort === option.value
                            ? "bg-primary-accent/10 font-medium text-primary-accent"
                            : "text-neutral-700 hover:bg-neutral-50",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-10 border-b border-neutral-200" />

            <div className="space-y-6">
              {results.map((result, index) => (
                <ResultCard
                  key={
                    result.type === "video"
                      ? `video:${result.lessonSlug}:${result.seconds}`
                      : `lesson:${result.lessonSlug}`
                  }
                  result={result}
                  position={index}
                />
              ))}
            </div>

            <BrowseAllCoursesCTA />
          </>
        ) : null}
      </div>
    </section>
  )
}

function BrowseAllCoursesCTA() {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl bg-primary-accent/5 border border-primary-accent/20">
      <div className="flex flex-col items-center gap-6 px-4 py-8 sm:px-8 sm:py-10 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-accent/10">
            <Search className="h-6 w-6 text-primary-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-500 font-poppins">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-sm text-neutral-600">
              Try different keywords or browse our full course catalog.
            </p>
          </div>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-accent/90 whitespace-nowrap"
        >
          Browse all courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}