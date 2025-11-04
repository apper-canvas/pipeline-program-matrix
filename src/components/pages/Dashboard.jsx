import { useState, useEffect } from "react"
import MetricCard from "@/components/molecules/MetricCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { taskService } from "@/services/api/taskService"
import { activityService } from "@/services/api/activityService"
import { format } from "date-fns"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: null,
    recentActivities: [],
    upcomingTasks: [],
    pipelineData: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getRecent(5)
      ])

      // Calculate metrics
      const totalContacts = contacts.length
      const activeContacts = contacts.filter(c => c.status === "active").length
      const totalDeals = deals.length
      const totalPipelineValue = deals
        .filter(d => !["closed-won", "closed-lost"].includes(d.stage))
        .reduce((sum, deal) => sum + deal.value, 0)
      const closedWonDeals = deals.filter(d => d.stage === "closed-won").length
      const conversionRate = totalDeals > 0 ? Math.round((closedWonDeals / totalDeals) * 100) : 0
      const pendingTasks = tasks.filter(t => t.status === "pending").length
      
      // Get upcoming tasks
      const upcomingTasks = tasks
        .filter(t => t.status === "pending")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)

      setDashboardData({
        metrics: {
          totalContacts,
          activeContacts,
          totalDeals,
          totalPipelineValue,
          conversionRate,
          pendingTasks
        },
        recentActivities: activities,
        upcomingTasks,
        pipelineData: deals
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Users",
      note: "FileText"
    }
    return icons[type] || "Activity"
  }

  const getPriorityVariant = (priority) => {
    const variants = {
      high: "danger",
      medium: "warning",
      low: "success"
    }
    return variants[priority] || "default"
  }

  const getTaskStatus = (task) => {
    const today = new Date().toISOString().split('T')[0]
    if (task.dueDate < today) return "overdue"
    if (task.dueDate === today) return "today"
    return "upcoming"
  }

  if (loading) return <Loading type="metrics" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-secondary-500">
            Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={dashboardData.metrics?.totalContacts || 0}
          change="+12%"
          changeType="up"
          icon="Users"
          iconColor="text-primary-500"
        />
        <MetricCard
          title="Active Deals"
          value={dashboardData.metrics?.totalDeals || 0}
          change="+8%"
          changeType="up"
          icon="Target"
          iconColor="text-success-500"
        />
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(dashboardData.metrics?.totalPipelineValue || 0)}
          change="+15%"
          changeType="up"
          icon="DollarSign"
          iconColor="text-accent-500"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dashboardData.metrics?.conversionRate || 0}%`}
          change="+3%"
          changeType="up"
          icon="TrendingUp"
          iconColor="text-success-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">Recent Activities</h2>
              <ApperIcon name="Activity" className="h-5 w-5 text-secondary-500" />
            </div>
          </div>
          <div className="p-6">
            {dashboardData.recentActivities.length === 0 ? (
              <Empty
                title="No activities yet"
                description="Start engaging with your contacts to see activity history here."
                icon="Activity"
                showAction={false}
              />
            ) : (
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        className="h-4 w-4 text-primary-600" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900">
                        {activity.subject}
                      </p>
                      <p className="text-sm text-secondary-600 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {format(new Date(activity.timestamp), "MMM dd 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">Upcoming Tasks</h2>
              <ApperIcon name="CheckSquare" className="h-5 w-5 text-secondary-500" />
            </div>
          </div>
          <div className="p-6">
            {dashboardData.upcomingTasks.length === 0 ? (
              <Empty
                title="No pending tasks"
                description="You're all caught up! New tasks will appear here."
                icon="CheckSquare"
                showAction={false}
              />
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingTasks.map((task) => {
                  const status = getTaskStatus(task)
                  return (
                    <div key={task.Id} className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="h-8 w-8 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="CheckSquare" className="h-4 w-4 text-accent-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900">
                            {task.title}
                          </p>
                          <p className="text-xs text-secondary-600">
                            Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityVariant(task.priority)} size="xs">
                          {task.priority}
                        </Badge>
                        {status === "overdue" && (
                          <Badge variant="danger" size="xs">
                            Overdue
                          </Badge>
                        )}
                        {status === "today" && (
                          <Badge variant="warning" size="xs">
                            Today
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">Pipeline Overview</h2>
        </div>
        <div className="p-6">
          {dashboardData.pipelineData && dashboardData.pipelineData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {["lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"].map((stage) => {
                const stageDeals = dashboardData.pipelineData.filter(deal => deal.stage === stage)
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
                const stageColors = {
                  lead: "bg-primary-50 text-primary-700",
                  qualified: "bg-accent-50 text-accent-700",
                  proposal: "bg-warning-50 text-warning-700",
                  negotiation: "bg-danger-50 text-danger-700",
                  "closed-won": "bg-success-50 text-success-700",
                  "closed-lost": "bg-secondary-50 text-secondary-700"
                }

                return (
                  <div key={stage} className="text-center">
                    <div className={`rounded-lg p-4 ${stageColors[stage]}`}>
                      <div className="text-2xl font-bold">{stageDeals.length}</div>
                      <div className="text-sm opacity-80 capitalize">
                        {stage.replace("-", " ")}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatCurrency(stageValue)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Empty
              title="No deals in pipeline"
              description="Start adding deals to see your pipeline overview here."
              icon="Target"
              showAction={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard