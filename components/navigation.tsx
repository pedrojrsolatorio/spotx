import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, GraduationCap, ChevronRight } from "lucide-react"
import Link from "next/link"

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  breadcrumbs?: { label: string; href?: string }[]
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary-accent" />
          <span className="text-heading-2 font-bold text-primary-500 font-poppins">
            SpotX
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/courses"
            className="text-body font-medium text-primary-500 hover:text-primary-accent transition-colors"
          >
            Courses
          </Link>
          <Link
            href="/my-learning"
            className="text-body font-medium text-neutral-700 hover:text-primary-accent transition-colors"
          >
            My Learning
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            placeholder="Search courses..."
            className="h-10 w-64 rounded-md border border-neutral-200 bg-neutral-100 pl-10 pr-4 text-body placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent"
          />
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
      className={cn("flex items-center gap-2 text-small text-neutral-500", className)}
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
