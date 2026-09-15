import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg",
  {
    variants: {
      variant: {
        primary: "bg-primary-accent text-white hover:bg-primary-accent/90 shadow-sm",
        secondary: "bg-white text-primary-accent border border-primary-accent hover:bg-primary-accent/5 shadow-sm",
        tertiary: "bg-white text-primary-500 border border-neutral-200 hover:bg-neutral-100 shadow-sm",
        text: "text-primary-accent hover:bg-primary-accent/5",
      },
      size: {
        default: "h-11 px-5 py-3 text-body",
        sm: "h-9 px-4 py-2 text-body",
        lg: "h-12 px-6 py-3 text-body-large",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
