import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"

const Header = ({ onMenuClick, onQuickAdd }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, message: "New deal: Acme Corp - $50,000", type: "deal" },
    { id: 2, message: "Task overdue: Follow up with John Smith", type: "task" },
    { id: 3, message: "Meeting in 30 minutes with Jane Doe", type: "meeting" }
  ]

  return (
    <header className="bg-white border-b border-secondary-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="h-5 w-5 text-secondary-600" />
          </button>
          
          <div className="hidden sm:block flex-1 max-w-lg">
            <SearchBar
              placeholder="Search contacts, deals, tasks..."
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={onQuickAdd}
            variant="primary"
            size="sm"
            icon="Plus"
            className="hidden sm:inline-flex"
          >
            Quick Add
          </Button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5 text-secondary-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="text-sm font-medium text-secondary-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-secondary-100 last:border-b-0 hover:bg-secondary-50">
                      <p className="text-sm text-secondary-700">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">JP</span>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden mt-3">
        <SearchBar
          placeholder="Search contacts, deals, tasks..."
          className="w-full"
        />
      </div>
    </header>
  )
}

export default Header