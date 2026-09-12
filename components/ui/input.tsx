import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, ChevronDown } from "lucide-react"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-body placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const SearchInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="search"
          className={cn(
            "flex h-11 w-full rounded-md border border-neutral-200 bg-white pl-10 pr-4 py-3 text-body placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-md border border-neutral-200 bg-white px-4 py-3 pr-10 text-body focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Input, SearchInput, Select }
