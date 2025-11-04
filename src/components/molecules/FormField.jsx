import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  children, 
  error, 
  required = false,
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-danger-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField