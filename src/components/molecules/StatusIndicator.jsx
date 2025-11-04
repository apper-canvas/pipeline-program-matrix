import { cn } from "@/utils/cn"

const StatusIndicator = ({ 
  status, 
  size = "sm",
  className 
}) => {
  const statusColors = {
    active: "bg-success-500",
    inactive: "bg-secondary-400",
    lead: "bg-primary-500",
    qualified: "bg-accent-500",
    proposal: "bg-warning-500",
    negotiation: "bg-danger-500",
    won: "bg-success-500",
    lost: "bg-secondary-400",
    high: "bg-danger-500",
    medium: "bg-warning-500",
    low: "bg-success-500",
    pending: "bg-accent-500",
    completed: "bg-success-500",
    overdue: "bg-danger-500"
  }

  const sizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  const colorClass = statusColors[status?.toLowerCase()] || statusColors.inactive
  const sizeClass = sizes[size] || sizes.sm

  return (
    <div className={cn("inline-flex items-center", className)}>
      <div className={cn("rounded-full", colorClass, sizeClass)} />
    </div>
  )
}

export default StatusIndicator