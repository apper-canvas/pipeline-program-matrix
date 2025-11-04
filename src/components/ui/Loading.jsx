import ApperIcon from "@/components/ApperIcon"

const Loading = ({ type = "cards", count = 6 }) => {
  if (type === "table") {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-200 bg-secondary-50">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-secondary-300 rounded w-32"></div>
              <div className="h-8 bg-secondary-300 rounded w-24"></div>
            </div>
          </div>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-secondary-200 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-secondary-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary-300 rounded w-1/3"></div>
                  <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-secondary-300 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "pipeline") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, columnIndex) => (
          <div key={columnIndex} className="pipeline-column animate-pulse">
            <div className="h-6 bg-secondary-300 rounded w-2/3 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200">
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary-300 rounded w-3/4"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                    <div className="h-6 bg-primary-200 rounded w-1/3 mt-3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "metrics") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="metric-card animate-pulse">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-primary-200 rounded-lg mr-4"></div>
              <div className="flex-1">
                <div className="h-8 bg-secondary-300 rounded w-20 mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="metric-card animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-secondary-300 rounded-lg mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-secondary-300 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-secondary-300 rounded w-1/4"></div>
            <div className="h-3 bg-secondary-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading