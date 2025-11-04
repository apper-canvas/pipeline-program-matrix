import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Avatar = forwardRef(({ 
  src,
  alt,
  children,
  className, 
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  }

  const baseClasses = "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 font-medium"
  const sizeClasses = sizes[size] || sizes.md

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(baseClasses, sizeClasses, "object-cover", className)}
        {...props}
      />
    )
  }

  return (
    <div
      ref={ref}
      className={cn(baseClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </div>
  )
})

Avatar.displayName = "Avatar"

export default Avatar