import * as React from "react"
import { cn } from "@/lib/utils"

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  size?: number
  strokeWidth?: number
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value, size = 120, strokeWidth = 10, className, ...props }, ref) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const clamped = Math.min(Math.max(value, 0), 100)
    const offset = circumference - (clamped / 100) * circumference

    return (
      <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)} {...props}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary-accent transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-heading-1 font-bold text-primary-500 font-poppins">{clamped}%</span>
          <span className="text-small text-neutral-500">complete</span>
        </div>
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export { CircularProgress }
