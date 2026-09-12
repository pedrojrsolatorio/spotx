import * as React from "react"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, showLabel = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className="w-full" ref={ref} {...props}>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-accent rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {showLabel && (
            <span className="text-sm text-neutral-700 whitespace-nowrap">
              {Math.round(percentage)}% complete
            </span>
          )}
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
