"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { PasswordInput } from "@/components/password-input";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });
      if (res.error) {
        setError(res.error.message || "Could not create account");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

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
                  <path d="M20 8L8 14L20 20L32 14L20 8Z" fill="white" />
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
                Start Your
                <br />
                Learning Journey.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Join thousands of learners mastering new skills with
                AI-powered content search.
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

          {/* Right column — sign-up form */}
          <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-3/5 lg:py-12">
            <div className="w-full max-w-sm">
              {/* Mobile branding */}
              <div className="mb-8 text-center lg:hidden">
                <Link href="/" className="inline-flex items-center gap-2">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="40" height="40" rx="8" fill="#FC563C" />
                    <path d="M20 8L8 14L20 20L32 14L20 8Z" fill="white" />
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

              <div className="mb-6 text-center lg:text-left">
                <h1 className="text-xl font-bold text-primary-500 font-poppins">
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Start your learning journey today
                </p>
              </div>

              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogle}
                className="mb-5 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-primary-500 transition-colors hover:bg-neutral-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-neutral-400">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-primary-500 placeholder:text-neutral-400 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-primary-500 placeholder:text-neutral-400 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-500">
                    Password
                  </label>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-primary-500 placeholder:text-neutral-400 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-primary-500 text-sm font-medium text-white transition-colors hover:bg-primary-accent disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="font-medium text-primary-accent hover:text-primary-accent/80"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
