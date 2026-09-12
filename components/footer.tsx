import * as React from "react"
import { cn } from "@/lib/utils"

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn("relative bg-primary-100 pt-16", className)}
      {...props}
    >
      <div className="mx-auto max-w-[1440px] px-8 pb-8">
        <div className="flex items-center justify-center gap-3 mb-16">
          <span className="text-primary-accent">✦</span>
          <div className="h-px w-8 bg-neutral-300" />
          <span className="text-body text-neutral-700">
            New courses and lessons added every week.
          </span>
          <div className="h-px w-8 bg-neutral-300" />
          <span className="text-primary-accent">✦</span>
        </div>
      </div>
      <div className="relative h-48 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100C240 150 480 50 720 100C960 150 1200 50 1440 100V200H0V100Z"
            fill="#6E7575"
          />
          <path
            d="M0 120C240 170 480 70 720 120C960 170 1200 70 1440 120V200H0V120Z"
            fill="#172A39"
          />
          <path
            d="M0 140C240 190 480 90 720 140C960 190 1200 90 1440 140V200H0V140Z"
            fill="#FC563C"
          />
        </svg>
      </div>
    </footer>
  )
)
Footer.displayName = "Footer"

export { Footer }
