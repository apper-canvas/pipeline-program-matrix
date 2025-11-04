import React, { useState } from "react";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, onQuickAdd }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const { logout } = useAuth()
  const { user } = useSelector(state => state.user)

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    return user?.emailAddress?.charAt(0).toUpperCase() || "U"
  }

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.emailAddress || "User"
  }

  return (
    <header className="bg-white border-b border-secondary-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
        >
          <ApperIcon name="Menu" size={20} />
        </button>
        
        <div className="hidden sm:flex items-center space-x-3 min-w-0 flex-1 max-w-md">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
              icon="Search"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
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
          
          <Button
            onClick={onQuickAdd}
            variant="primary"
            size="sm"
            className="sm:hidden"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors">
            <ApperIcon name="Bell" size={18} />
          </button>
          
          <div className="flex items-center space-x-3 pl-3 border-l border-secondary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {getUserInitials()}
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium text-secondary-900">{getUserName()}</div>
              <div className="text-xs text-secondary-500">User</div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-secondary-600 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
              title="Logout"
            >
              <ApperIcon name="LogOut" size={16} />
            </button>
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