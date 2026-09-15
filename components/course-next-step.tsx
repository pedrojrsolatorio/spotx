"use client";

import { Target, ArrowRight } from "lucide-react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CourseNextStepProps {
  courseSlug: string;
  firstLessonSlug: string | null;
}

export function CourseNextStep({
  courseSlug,
  firstLessonSlug,
}: CourseNextStepProps) {
  const href = firstLessonSlug
    ? `/lesson/${firstLessonSlug}`
    : `/course/${courseSlug}`;

  return (
    <section className="rounded-2xl bg-[#FBF7F4] px-8 py-10">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-accent/10">
            <Target className="h-6 w-6 text-primary-accent" />
          </div>
          <div>
            <h3 className="text-heading-2 font-bold text-primary-500 font-poppins">
              Your next step
            </h3>
            <p className="text-body leading-body text-neutral-500">
              Start learning and build real-world projects.
            </p>
          </div>
        </div>

        <Link
          href={href}
          onClick={() => {
            if (
              process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
              process.env.NEXT_PUBLIC_POSTHOG_HOST
            ) {
              posthog.capture("course_learning_started", {
                course_slug: courseSlug,
                has_first_lesson: Boolean(firstLessonSlug),
              });
            }
          }}
        >
          <Button variant="primary" size="lg" className="gap-2">
            Continue Learning
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
