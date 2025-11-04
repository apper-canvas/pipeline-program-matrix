import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import QuickAddModal from "@/components/organisms/QuickAddModal"
import { taskService } from "@/services/api/taskService"
import { contactService } from "@/services/api/contactService"
import { format, isToday, isPast, isTomorrow } from "date-fns"
import { toast } from "react-toastify"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
const [filterPriority, setFilterPriority] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const loadTasks = async () => {
    try {
      setError("")
      setLoading(true)
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ])
      setTasks(tasksData)
      setContacts(contactsData)
      setFilteredTasks(tasksData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description.toLowerCase().includes(lowerSearch)
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      if (filterStatus === "overdue") {
        const today = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(task => 
          task.status === "pending" && task.dueDate < today
        )
      } else {
        filtered = filtered.filter(task => task.status === filterStatus)
      }
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, filterStatus, filterPriority])

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.completeTask(taskId)
      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updatedTask : t
      ))
      toast.success("Task completed!")
    } catch (err) {
      toast.error("Failed to complete task")
    }
  }

  const getContactName = (contactId) => {
    if (!contactId) return "Unassigned"
    const contact = contacts.find(c => c.Id.toString() === contactId.toString())
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown"
  }

  const getPriorityVariant = (priority) => {
    const variants = {
      high: "danger",
      medium: "warning",
      low: "success"
    }
    return variants[priority] || "default"
  }

  const getTaskDateInfo = (task) => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    
    if (isPast(dueDate) && task.status === "pending") {
      return { label: "Overdue", variant: "danger", urgent: true }
    }
    if (isToday(dueDate)) {
      return { label: "Today", variant: "warning", urgent: true }
    }
    if (isTomorrow(dueDate)) {
      return { label: "Tomorrow", variant: "primary", urgent: false }
    }
    return { label: format(dueDate, "MMM dd"), variant: "default", urgent: false }
  }

  const groupTasksByDate = (tasks) => {
    const today = new Date().toISOString().split('T')[0]
    const groups = {
      overdue: [],
      today: [],
      upcoming: [],
      completed: []
    }

    tasks.forEach(task => {
      if (task.status === "completed") {
        groups.completed.push(task)
      } else if (task.dueDate < today) {
        groups.overdue.push(task)
      } else if (task.dueDate === today) {
        groups.today.push(task)
      } else {
        groups.upcoming.push(task)
      }
    })

    return groups
  }

  const renderTaskGroup = (title, tasks, color = "secondary") => {
    if (tasks.length === 0) return null

    return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className={`px-6 py-4 border-b border-secondary-200 bg-${color}-50`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold text-${color}-900`}>
              {title}
            </h3>
            <Badge variant={color} size="sm">
              {tasks.length}
            </Badge>
          </div>
        </div>
        <div className="divide-y divide-secondary-200">
          {tasks.map((task, index) => {
            const dateInfo = getTaskDateInfo(task)
            return (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => handleCompleteTask(task.Id)}
                      disabled={task.status === "completed"}
                      className="mt-1 p-1 hover:bg-success-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {task.status === "completed" ? (
                        <ApperIcon name="CheckCircle2" className="h-5 w-5 text-success-500" />
                      ) : (
                        <ApperIcon name="Circle" className="h-5 w-5 text-secondary-400 hover:text-success-500" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${
                        task.status === "completed" 
                          ? "text-secondary-500 line-through" 
                          : "text-secondary-900"
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-secondary-600 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-secondary-500">
                          {getContactName(task.contactId)}
                        </span>
                        <Badge variant={dateInfo.variant} size="xs">
                          {dateInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant={getPriorityVariant(task.priority)} size="xs">
                      {task.priority}
                    </Badge>
                    <button className="p-1 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded transition-colors">
                      <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadTasks} />

  const groupedTasks = groupTasksByDate(filteredTasks)
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "completed").length
  const overdueTasks = groupedTasks.overdue.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Tasks</h1>
          <p className="text-secondary-600 mt-1">
            Stay organized and track your daily activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button icon="Calendar" variant="secondary" size="sm">
            Calendar View
          </Button>
<Button icon="Plus" size="sm" onClick={() => setShowQuickAdd(true)}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CheckSquare" className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-900">{totalTasks}</div>
              <div className="text-sm text-secondary-600">Total Tasks</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-900">{completedTasks}</div>
              <div className="text-sm text-secondary-600">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-900">{groupedTasks.today.length}</div>
              <div className="text-sm text-secondary-600">Due Today</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-danger-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-danger-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-900">{overdueTasks}</div>
              <div className="text-sm text-secondary-600">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-32"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-32"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-6">
        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            description="No tasks match your current filters. Try adjusting your search criteria or add a new task."
            icon="CheckSquare"
            actionLabel="Add Task"
            onAction={() => toast.info("Add task functionality would open here")}
          />
        ) : (
          <>
            {renderTaskGroup("Overdue", groupedTasks.overdue, "danger")}
            {renderTaskGroup("Due Today", groupedTasks.today, "warning")}
            {renderTaskGroup("Upcoming", groupedTasks.upcoming, "primary")}
            {renderTaskGroup("Completed", groupedTasks.completed, "success")}
          </>
)}
      </div>
      
      <QuickAddModal 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        defaultTab="task"
        onTaskCreated={loadTasks}
      />
    </div>
  )
}

export default Tasks