import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <ApperIcon name="Search" className="h-16 w-16 text-primary-600" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
            <ApperIcon name="X" className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Page Not Found
          </h2>
          <p className="text-secondary-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to your CRM dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => navigate("/")}
            icon="Home"
            size="lg"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            icon="ArrowLeft"
            size="lg"
          >
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-secondary-200">
          <p className="text-sm text-secondary-500">
            Need help? Try searching for contacts, deals, or tasks using the search bar.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound