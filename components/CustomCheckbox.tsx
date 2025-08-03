import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
}

const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(
  ({ className, label, labelClassName, ...props }, ref) => (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        className={cn(
          "h-5 w-5 rounded border border-nature-sage text-nature-green focus:ring-nature-green",
          "checked:bg-nature-green checked:border-nature-green",
          "transition-colors duration-200 ease-in-out",
          "cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "text-nature-green cursor-pointer flex-1",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
)

CustomCheckbox.displayName = "CustomCheckbox"

export { CustomCheckbox }