import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  size = "sm",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
    danger: "bg-danger-100 text-danger-700",
    active: "bg-success-100 text-success-700",
    inactive: "bg-secondary-100 text-secondary-500",
    high: "bg-danger-100 text-danger-700",
    medium: "bg-warning-100 text-warning-700",
    low: "bg-success-100 text-success-700"
  }

  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm"
  }

  const baseClasses = "inline-flex items-center font-medium rounded-full"
  const variantClasses = variants[variant] || variants.default
  const sizeClasses = sizes[size] || sizes.sm

  return (
    <span
      ref={ref}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge