import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found",
  description = "There's nothing to display yet.",
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox",
  showAction = true 
}) => {
  return (
    <div className="min-h-64 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
          <ApperIcon 
            name={icon} 
            className="h-10 w-10 text-secondary-500" 
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-secondary-900">
            {title}
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            {description}
          </p>
        </div>
        {showAction && onAction && (
          <div className="pt-2">
            <button
              onClick={onAction}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Empty