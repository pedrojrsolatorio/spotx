import { Lightbulb } from "lucide-react"

interface LessonProTipProps {
  proTip: string
}

export function LessonProTip({ proTip }: LessonProTipProps) {
  if (!proTip) return null

  return (
    <div className="rounded-2xl bg-primary-accent/5 border border-primary-accent/10 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-accent/10">
          <Lightbulb className="h-5 w-5 text-primary-accent" />
        </div>
        <h3 className="text-lg font-semibold text-primary-500 font-poppins">
          Pro Tip
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-neutral-700">
        {proTip}
      </p>
    </div>
  )
}
