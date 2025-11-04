import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong while loading the data.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="min-h-64 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto p-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-danger-100 to-danger-200 flex items-center justify-center">
          <ApperIcon 
            name="AlertTriangle" 
            className="h-8 w-8 text-danger-600" 
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary-900">
            Oops! Something went wrong
          </h3>
          <p className="text-secondary-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
        <div className="pt-4">
          <p className="text-xs text-secondary-500">
            If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error