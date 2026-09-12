import * as React from "react"
import { cn } from "@/lib/utils"
import { Bell, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  activeRoute?: string
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, activeRoute = "courses", ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex items-center justify-between bg-white px-8 py-5",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#FC563C"/>
              <path d="M20 8L8 14L20 20L32 14L20 8Z" fill="white"/>
              <path d="M8 14V20L20 26V20L8 14Z" fill="white" fillOpacity="0.9"/>
              <path d="M32 14V20L20 26V20L32 14Z" fill="white" fillOpacity="0.8"/>
              <path d="M11 22V28L20 32V26L11 22Z" fill="white" fillOpacity="0.7"/>
              <path d="M29 22V28L20 32V26L29 22Z" fill="white" fillOpacity="0.6"/>
            </svg>
            <span className="text-2xl font-bold text-primary-500 font-poppins">
              SpotX
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className={cn(
                "text-base font-medium transition-colors relative pb-1",
                activeRoute === "courses"
                  ? "text-primary-500"
                  : "text-neutral-700 hover:text-primary-accent"
              )}
            >
              Courses
              {activeRoute === "courses" && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-accent" />
              )}
            </Link>
            <Link
              href="/my-learning"
              className={cn(
                "text-base font-medium transition-colors relative pb-1",
                activeRoute === "my-learning"
                  ? "text-primary-500"
                  : "text-neutral-700 hover:text-primary-accent"
              )}
            >
              My Learning
              {activeRoute === "my-learning" && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-accent" />
              )}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-neutral-700 hover:text-primary-accent transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>
          <button className="flex items-center gap-2 rounded-full p-1 hover:bg-neutral-100 transition-colors">
            <div className="h-11 w-11 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border-2 border-neutral-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#9CA3AF"/>
                <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V20H4V20Z" fill="#9CA3AF"/>
              </svg>
            </div>
            <ChevronDown className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
      </div>
    </nav>
  )
)
Navigation.displayName = "Navigation"

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: { label: string; href?: string }[]
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex items-center gap-2 text-sm text-neutral-500", className)}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary-accent transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary-500 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
)
Breadcrumbs.displayName = "Breadcrumbs"

export { Navigation, Breadcrumbs }
