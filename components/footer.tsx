"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn("relative bg-primary-100", className)}
      {...props}
    >
      {/* Tagline */}
      <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-24 lg:px-8 lg:pt-32 lg:pb-32">
        <div className="flex items-center justify-center gap-3">
          <span className="text-primary-accent">✦</span>
          <div className="h-px w-8 bg-neutral-300" />
          <span className="text-body text-neutral-700">
            New courses and lessons added every week.
          </span>
          <div className="h-px w-8 bg-neutral-300" />
          <span className="text-primary-accent">✦</span>
        </div>
      </div>

      {/* Wave transition into dark footer */}
      <div className="relative h-40 -mt-1">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Light grey过渡 — smooth curve from page bg into dark */}
          <path
            d="M0 0H1440V60C1440 60 1200 100 960 90C720 80 480 110 240 95C120 87 60 100 0 100V0Z"
            fill="#F8F8F7"
          />
          {/* Dark navy — dominant flowing shape */}
          <path
            d="M0 90C120 82 360 110 600 95C840 80 1080 108 1320 92C1380 88 1420 95 1440 98V160H0V90Z"
            fill="#172A39"
          />
          {/* Orange accent — asymmetric wave on the right */}
          <path
            d="M700 130C820 115 980 140 1140 125C1260 115 1360 135 1440 128V160H700V130Z"
            fill="#FC563C"
          />
        </svg>
      </div>

      {/* Dark footer content */}
      <div className="bg-primary-500">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="28" height="28" rx="6" fill="#FC563C" />
                  <path
                    d="M8 10h12v2H8zM8 14h8v2H8zM8 18h10v2H8z"
                    fill="white"
                  />
                </svg>
                <span className="font-poppins text-xl font-semibold text-white">
                  SpotX
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-neutral-300">
                AI-powered learning platform with intelligent content search.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-poppins text-sm font-semibold uppercase tracking-wider text-neutral-300">
                Platform
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/courses"
                    className="text-sm text-neutral-300 transition-colors hover:text-white"
                  >
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-sm text-neutral-300 transition-colors hover:text-white"
                  >
                    Search
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-poppins text-sm font-semibold uppercase tracking-wider text-neutral-300">
                Account
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/account/settings"
                    className="text-sm text-neutral-300 transition-colors hover:text-white"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/security"
                    className="text-sm text-neutral-300 transition-colors hover:text-white"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-poppins text-sm font-semibold uppercase tracking-wider text-neutral-300">
                Legal
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <span className="text-sm text-neutral-300">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="text-sm text-neutral-300">
                    Privacy Policy
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 border-t border-neutral-700 pt-8">
            <p className="text-center text-xs text-neutral-300">
              © {new Date().getFullYear()} SpotX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  ),
);
Footer.displayName = "Footer";

export { Footer };
