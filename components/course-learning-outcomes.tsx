import { CourseIcon } from "@/components/course-icon"
import type { COURSE_QUERY_RESULT } from "@/sanity.types"

type Course = NonNullable<COURSE_QUERY_RESULT>

interface CourseLearningOutcomesProps {
  learningOutcomes: Course["learningOutcomes"]
}

export function CourseLearningOutcomes({ learningOutcomes }: CourseLearningOutcomesProps) {
  if (!learningOutcomes || learningOutcomes.length === 0) return null

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="h-1 w-12 rounded-full bg-primary-accent" />
        <h2 className="text-display-2 font-bold text-primary-500 font-poppins">
          What you&apos;ll learn
        </h2>
        <p className="max-w-md text-body leading-body text-neutral-700">
          Gain practical skills to build, optimize, and deploy modern web applications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {learningOutcomes.map((outcome) => (
          <div
            key={outcome._key}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-accent/10">
              <CourseIcon name={outcome.icon} size={20} className="text-primary-accent" />
            </div>
            <h3 className="mb-1 text-body-large font-semibold text-primary-500 font-poppins">
              {outcome.title}
            </h3>
            <p className="text-body leading-body text-neutral-500">
              {outcome.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
