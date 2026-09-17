import {
  BarChart3,
  Clock,
  BookOpen,
  Users,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import type { COURSE_QUERY_RESULT } from "@/sanity.types";

type Course = NonNullable<COURSE_QUERY_RESULT>;

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

interface CourseHeroProps {
  course: Course;
  totalDuration: number;
  moduleCount: number;
  lessonCount: number;
  firstLessonSlug?: string | null;
}

export function CourseHero({
  course,
  totalDuration,
  moduleCount,
  lessonCount,
  firstLessonSlug,
}: CourseHeroProps) {
  const imageUrl = course.coverImage?.asset?.url
    ? urlFor(course.coverImage).width(600).height(400).url()
    : null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#FBF7F4] px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary-accent/5 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary-accent/8 blur-2xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
        <div className="space-y-6">
          {course.popular && <Badge variant="popular">Popular</Badge>}

          <h1 className="text-display-1 font-bold leading-display-1 text-primary-500 font-poppins">
            {course.title}
          </h1>

          <p className="max-w-lg text-body-large leading-body-large text-neutral-700">
            {course.summary}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-body text-neutral-500">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5" />
              {course.level &&
                course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5" />
              {formatDuration(totalDuration)}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5" />
              {moduleCount} modules
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5" />
              {course.studentCount
                ? `${(course.studentCount / 1000).toFixed(1)}k`
                : "0"}{" "}
              students
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href={firstLessonSlug ? `/lesson/${firstLessonSlug}` : "#"}>
              <Button variant="primary" size="lg" className="gap-2">
                Start Learning
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="gap-2">
              <Bookmark className="h-4.5 w-4.5" />
              Save for Later
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative aspect-[3/2] w-full max-w-[340px] overflow-hidden rounded-xl shadow-xl">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={course.coverImage?.alt || course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-white text-heading-1 font-bold font-poppins">
                {course.title.charAt(0)}
              </div>
            )}
            {course.category && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-small font-medium text-primary-500 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-primary-accent" />
                {course.category.title}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
