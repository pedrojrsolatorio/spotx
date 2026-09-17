import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AccountView } from "@neondatabase/auth-ui"
import { accountViewPaths } from "@neondatabase/auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }))
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params

  return (
    <main className="auth-ui-scope grow px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="flex justify-center">
          <AccountView path={path} />
        </div>
      </div>
    </main>
  )
}