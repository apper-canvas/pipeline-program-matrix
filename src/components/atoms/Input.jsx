import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Input = forwardRef(({ 
  className, 
  type = "text",
  icon,
  iconPosition = "left",
  error,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
  const errorClasses = error ? "border-danger-300 bg-danger-50" : "border-secondary-300 bg-white hover:border-secondary-400"
  
  if (icon) {
    return (
      <div className="relative">
        {iconPosition === "left" && (
          <ApperIcon 
            name={icon} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" 
          />
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            baseClasses,
            errorClasses,
            iconPosition === "left" ? "pl-10" : "pr-10",
            className
          )}
          {...props}
        />
        {iconPosition === "right" && (
          <ApperIcon 
            name={icon} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" 
          />
        )}
      </div>
    )
  }

  return (
    <input
      type={type}
      ref={ref}
      className={cn(baseClasses, errorClasses, className)}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input