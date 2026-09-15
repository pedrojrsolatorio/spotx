import { Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CourseNextStepProps {
  courseSlug: string
  firstLessonSlug: string | null
}

export function CourseNextStep({ courseSlug, firstLessonSlug }: CourseNextStepProps) {
  const href = firstLessonSlug ? `/lesson/${firstLessonSlug}` : `/course/${courseSlug}`

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

        <Link href={href}>
          <Button variant="primary" size="lg" className="gap-2">
            Continue Learning
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
