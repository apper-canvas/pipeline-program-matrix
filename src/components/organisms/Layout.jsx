import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import QuickAddModal from "@/components/organisms/QuickAddModal"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="flex-1 min-h-screen">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            onQuickAdd={() => setShowQuickAdd(true)}
          />
          
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <QuickAddModal 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </div>
  )
}

export default Layout