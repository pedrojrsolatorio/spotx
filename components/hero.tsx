import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";

const Hero = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-primary-100 px-8 py-16 md:py-24",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-200 px-4.5 py-2 text-sm font-medium text-primary-accent mb-8">
              <span className="text-primary-accent">✦</span>
              INTELLIGENT LEARNING
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary-500 font-poppins mb-6 leading-tight">
              Search your learning in plain English.
            </h1>
            <p className="text-lg text-neutral-700 mb-8 max-w-lg leading-relaxed">
              Vertex understands what you want to learn and finds the exact
              lessons across all your courses.
            </p>
            <div className="mb-8">
              <div className="flex items-center rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm max-w-lg">
                <Search className="ml-3 h-5 w-5 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Ask anything about your learning..."
                  className="flex-1 border-0 bg-transparent px-4 py-3 text-base placeholder:text-neutral-400 focus:outline-none"
                />
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-accent text-white">
                  <span className="text-sm font-medium">⌘K</span>
                </div>
              </div>
            </div>
            <Link
              href="/courses"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-accent px-7.5 py-3.5 text-base font-medium text-white transition-colors hover:bg-primary-accent/90 shadow-sm"
            >
              Explore Courses
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/hero-illustration.svg"
                alt="Student learning"
                className="w-full max-w-lg mx-auto"
              />
            </div>
            <div className="absolute top-8 right-8 z-20 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary-accent/10">
                <Lightbulb className="h-7.5 w-7.5 text-primary-accent" />
              </div>
              <div>
                <div className="text-base font-medium text-primary-500">
                  Learn
                </div>
                <div className="text-base font-medium text-primary-500">
                  Smarter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-100/0 to-transparent" />
    </section>
  ),
);
Hero.displayName = "Hero";

export { Hero };
