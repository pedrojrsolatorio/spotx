"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Bell, ChevronRight } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from "@neondatabase/auth-ui"
import Link from "next/link"

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  activeRoute?: string
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, activeRoute, ...props }, ref) => {
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20)
      }
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-5 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
            : "bg-white/60 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
          <div className="flex items-center gap-8 md:gap-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="8" fill="#FC563C"/>
                  <path d="M20 8L8 14L20 20L32 14L20 8Z" fill="white"/>
                  <path d="M8 14V20L20 26V20L8 14Z" fill="white" fillOpacity="0.9"/>
                  <path d="M32 14V20L20 26V20L32 14Z" fill="white" fillOpacity="0.8"/>
                  <path d="M11 22V28L20 32V26L11 22Z" fill="white" fillOpacity="0.7"/>
                  <path d="M29 22V28L20 32V26L29 22Z" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-primary-500 font-poppins transition-transform duration-300 group-hover:translate-x-1">
                SpotX
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-12">
              <Link
                href="/courses"
                className={cn(
                  "text-base font-medium transition-all duration-300 relative pb-1 hover:scale-105",
                  activeRoute === "courses"
                    ? "text-primary-500"
                    : "text-neutral-700 hover:text-primary-accent"
                )}
              >
                Courses
                {activeRoute === "courses" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-accent animate-[scaleX_0.3s_ease-out]" />
                )}
              </Link>
              <Link
                href="/my-learning"
                className={cn(
                  "text-base font-medium transition-all duration-300 relative pb-1 hover:scale-105",
                  activeRoute === "my-learning"
                    ? "text-primary-500"
                    : "text-neutral-700 hover:text-primary-accent"
                )}
              >
                My Learning
                {activeRoute === "my-learning" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-accent animate-[scaleX_0.3s_ease-out]" />
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <SignedIn>
              <button className="relative p-2 text-neutral-700 hover:text-primary-accent transition-all duration-300 hover:scale-110 hover:-rotate-12">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
              </button>
            </SignedIn>
            <SignedIn>
              <UserButton size="icon" className="size-11" />
            </SignedIn>
            <SignedOut>
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-accent"
              >
                Sign in
              </Link>
            </SignedOut>
          </div>
        </div>
      </nav>
    )
  }
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
              className="hover:text-primary-accent transition-colors duration-200"
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
