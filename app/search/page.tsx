import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { SearchResults } from "@/components/search/search-results"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: "Search Results | SpotX",
  description: "Search your learning in plain English across every SpotX course.",
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = (q ?? "").trim()

  return (
    <div className="min-h-screen bg-primary-100">
      <Navigation />
      <main className="pt-28 pb-16">
        <SearchResults query={query} />
      </main>
      <Footer />
    </div>
  )
}