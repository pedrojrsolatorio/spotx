import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Clock, CheckCircle, Play, Lock } from "lucide-react"

const statusVariants = cva(
  "inline-flex items-center gap-2 text-sm font-medium",
  {
    variants: {
      variant: {
        "in-progress": "text-primary-accent",
        completed: "text-success",
        "now-playing": "text-primary-accent",
        locked: "text-neutral-500",
      },
    },
    defaultVariants: {
      variant: "in-progress",
    },
  }
)

const statusIcons = {
  "in-progress": Clock,
  completed: CheckCircle,
  "now-playing": Play,
  locked: Lock,
}

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  showIcon?: boolean
}

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ className, variant, showIcon = true, ...props }, ref) => {
    const Icon = variant ? statusIcons[variant] : Clock

    return (
      <span
        className={cn(statusVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {showIcon && <Icon className="h-4.5 w-4.5" />}
        <span className="capitalize">
          {variant?.replace("-", " ") || "In Progress"}
        </span>
      </span>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

export { StatusIndicator, statusVariants }
