import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MetricCard = ({ 
  title,
  value,
  change,
  changeType,
  icon,
  iconColor = "text-primary-500",
  trend = "up",
  className,
  onClick,
  ...props 
}) => {
  const trendColors = {
    up: "text-success-600",
    down: "text-danger-600",
    flat: "text-secondary-500"
  }

  const trendIcons = {
    up: "TrendingUp",
    down: "TrendingDown",
    flat: "Minus"
  }

  return (
    <div 
      className={cn(
        "metric-card cursor-pointer transform hover:scale-105 transition-all duration-200",
        onClick && "hover:shadow-lg",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-secondary-900 mb-1">
            {value}
          </p>
          {change && (
            <div className={cn("flex items-center text-sm", trendColors[changeType] || trendColors.up)}>
              <ApperIcon 
                name={trendIcons[changeType] || trendIcons.up} 
                className="h-4 w-4 mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("h-12 w-12 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center", iconColor)}>
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard