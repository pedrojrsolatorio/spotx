import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";

export const dynamicParams = false;

const SKIP_PATHS = new Set(["sign-in", "sign-up"]);

export function generateStaticParams() {
  return Object.values(authViewPaths)
    .filter((path) => !SKIP_PATHS.has(path))
    .map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="auth-ui-scope flex min-h-screen flex-col bg-primary-100">
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl lg:flex lg:min-h-[560px]">
          {/* Left column — SpotX branding */}
          <div className="relative hidden bg-primary-500 px-10 py-12 lg:flex lg:w-2/5 lg:flex-col lg:justify-between">
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary-accent/10" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-primary-accent/5" />

            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="8" fill="#FC563C" />
                  <path
                    d="M20 8L8 14L20 20L32 14L20 8Z"
                    fill="white"
                  />
                  <path
                    d="M8 14V20L20 26V20L8 14Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <path
                    d="M32 14V20L20 26V20L32 14Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <span className="font-poppins text-xl font-semibold text-white">
                  SpotX
                </span>
              </Link>

              <h2 className="mt-8 text-2xl font-bold text-white font-poppins leading-tight">
                Learn Smarter,
                <br />
                Not Harder.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                AI-powered search finds the exact moment in any lesson that
                answers your question.
              </p>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-primary-accent">&#10022;</span>
                <div className="h-px flex-1 bg-neutral-600" />
                <span className="text-primary-accent">&#10022;</span>
              </div>
              <p className="mt-3 text-xs text-neutral-400">
                New courses and lessons added every week.
              </p>
            </div>
          </div>

          {/* Right column — auth form (fallback for forgot-password, etc.) */}
          <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-3/5 lg:py-12">
            <div className="w-full max-w-sm">
              <div className="mb-8 text-center lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="40" height="40" rx="8" fill="#FC563C" />
                    <path
                      d="M20 8L8 14L20 20L32 14L20 8Z"
                      fill="white"
                    />
                    <path
                      d="M8 14V20L20 26V20L8 14Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path
                      d="M32 14V20L20 26V20L32 14Z"
                      fill="white"
                      fillOpacity="0.8"
                    />
                  </svg>
                  <span className="font-poppins text-lg font-semibold text-primary-500">
                    SpotX
                  </span>
                </Link>
              </div>

              <AuthView
                path={path}
                socialLayout="vertical"
                classNames={{
                  base: "w-full",
                  content: "gap-5",
                  form: {
                    base: "gap-4",
                    input:
                      "h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-primary-500 placeholder:text-neutral-400 focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20",
                    label: "text-sm font-medium text-primary-500",
                    primaryButton:
                      "h-11 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-accent transition-colors",
                    secondaryButton:
                      "h-11 rounded-xl border border-neutral-200 bg-white text-primary-500 font-medium transition-colors",
                    providerButton:
                      "h-11 rounded-xl border border-neutral-200 bg-white text-primary-500 font-medium transition-colors",
                    forgotPasswordLink:
                      "text-sm text-primary-accent hover:text-primary-accent/80",
                    description: "text-sm text-neutral-500",
                    error: "text-sm text-red-600",
                  },
                  footer: "text-center text-sm text-neutral-500",
                  footerLink:
                    "text-sm font-medium text-primary-accent hover:text-primary-accent/80",
                  continueWith:
                    "text-sm text-neutral-400",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
