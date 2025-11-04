import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Select = forwardRef(({ 
  children,
  className,
  error,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
  const errorClasses = error ? "border-danger-300 bg-danger-50" : "border-secondary-300 hover:border-secondary-400"

  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(baseClasses, errorClasses, className)}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none" 
      />
    </div>
  )
})

Select.displayName = "Select"

export default Select