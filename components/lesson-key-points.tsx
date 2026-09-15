import { Lightbulb, CheckCircle2 } from "lucide-react"

interface LessonKeyPointsProps {
  keyPoints: string[]
}

export function LessonKeyPoints({ keyPoints }: LessonKeyPointsProps) {
  if (!keyPoints.length) return null

  return (
    <div className="rounded-2xl bg-neutral-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-accent/10">
          <Lightbulb className="h-5 w-5 text-primary-accent" />
        </div>
        <h3 className="text-lg font-semibold text-primary-500 font-poppins">
          In this lesson you will:
        </h3>
      </div>
      <ul className="space-y-3">
        {keyPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
            <span className="text-sm text-neutral-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
