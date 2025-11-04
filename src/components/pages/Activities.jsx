import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const ActivitiesContent = ({ onOpenModal }) => {
const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterOutcome, setFilterOutcome] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
const loadActivities = async () => {
    try {
      setError("")
      setLoading(true)
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
      setDeals(dealsData)
      setFilteredActivities(activitiesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (tab = 'activity') => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Reload activities after modal closes to show new activity
    loadActivities()
  }

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    let filtered = [...activities]

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType)
    }

    // Apply outcome filter
    if (filterOutcome !== "all") {
      filtered = filtered.filter(activity => activity.outcome === filterOutcome)
    }

    setFilteredActivities(filtered)
  }, [activities, filterType, filterOutcome])

  const getContactName = (contactId) => {
    if (!contactId) return "Unknown"
    const contact = contacts.find(c => c.Id.toString() === contactId.toString())
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown"
  }

  const getDealName = (dealId) => {
    if (!dealId) return null
    const deal = deals.find(d => d.Id.toString() === dealId.toString())
    return deal ? deal.name : null
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

  const getActivityColor = (type) => {
    const colors = {
      call: "text-success-500 bg-success-50",
      email: "text-primary-500 bg-primary-50",
      meeting: "text-accent-500 bg-accent-50",
      note: "text-secondary-500 bg-secondary-50"
    }
    return colors[type] || "text-secondary-500 bg-secondary-50"
  }

  const getOutcomeVariant = (outcome) => {
    const variants = {
      positive: "success",
      negative: "danger",
      neutral: "secondary",
      "follow-up": "warning",
      "closed-won": "success",
      concern: "warning",
      sent: "primary"
    }
    return variants[outcome] || "default"
  }

  const formatActivityDate = (timestamp) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`
    }
    return format(date, "MMM dd 'at' h:mm a")
  }

  const groupActivitiesByDate = (activities) => {
    const groups = {}
    
    activities.forEach(activity => {
      const date = new Date(activity.timestamp)
      let groupKey
      
      if (isToday(date)) {
        groupKey = "Today"
      } else if (isYesterday(date)) {
        groupKey = "Yesterday"
      } else {
        groupKey = format(date, "MMMM dd, yyyy")
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(activity)
    })
    
    return groups
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadActivities} />

  const groupedActivities = groupActivitiesByDate(filteredActivities)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Activities</h1>
          <p className="text-secondary-600 mt-1">
            Track all your customer interactions and engagement history
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button icon="Download" variant="secondary" size="sm">
            Export
          </Button>
<Button 
            icon="Plus" 
            size="sm"
            onClick={() => onOpenModal('activity')}
          >
            Log Activity
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { type: "call", icon: "Phone", label: "Calls", color: "success" },
          { type: "email", icon: "Mail", label: "Emails", color: "primary" },
          { type: "meeting", icon: "Users", label: "Meetings", color: "accent" },
          { type: "note", icon: "FileText", label: "Notes", color: "secondary" }
        ].map(({ type, icon, label, color }) => {
          const count = activities.filter(a => a.type === type).length
          return (
            <div key={type} className="bg-white rounded-lg p-4 border border-secondary-200">
              <div className="flex items-center">
                <div className={`h-10 w-10 bg-${color}-100 rounded-lg flex items-center justify-center mr-3`}>
                  <ApperIcon name={icon} className={`h-5 w-5 text-${color}-600`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-900">{count}</div>
                  <div className="text-sm text-secondary-600">{label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-32"
            >
              <option value="all">All Types</option>
              <option value="call">Calls</option>
              <option value="email">Emails</option>
              <option value="meeting">Meetings</option>
              <option value="note">Notes</option>
            </Select>
            <Select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value)}
              className="w-32"
            >
              <option value="all">All Outcomes</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
              <option value="follow-up">Follow-up</option>
            </Select>
          </div>
          <div className="text-sm text-secondary-500">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description="No activities match your current filters or there are no activities logged yet."
icon="Activity"
          actionLabel="Log Activity"
          onAction={() => handleOpenModal('activity')}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([dateGroup, dayActivities]) => (
            <div key={dateGroup} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
              <div className="px-6 py-4 bg-secondary-50 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">{dateGroup}</h3>
              </div>
              <div className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-secondary-200"></div>
                  
                  {/* Activities */}
                  <div className="space-y-6">
                    {dayActivities.map((activity, index) => {
                      const dealName = getDealName(activity.dealId)
                      return (
                        <motion.div
                          key={activity.Id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex items-start space-x-4"
                        >
                          {/* Timeline dot */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${getActivityColor(activity.type)}`}>
                            <ApperIcon 
                              name={getActivityIcon(activity.type)} 
                              className="h-5 w-5" 
                            />
                          </div>
                          
                          {/* Activity content */}
                          <div className="flex-1 min-w-0 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-medium text-secondary-900">
                                {activity.subject}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant={getOutcomeVariant(activity.outcome)} size="sm">
                                  {activity.outcome}
                                </Badge>
                                <span className="text-sm text-secondary-500">
                                  {format(new Date(activity.timestamp), "h:mm a")}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-secondary-700 mb-3">
                              {activity.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                              <span className="flex items-center">
                                <ApperIcon name="User" className="h-4 w-4 mr-1" />
                                {getContactName(activity.contactId)}
                              </span>
                              
                              {dealName && (
                                <span className="flex items-center">
                                  <ApperIcon name="Target" className="h-4 w-4 mr-1" />
                                  {dealName}
                                </span>
                              )}
                              
                              {activity.duration > 0 && (
                                <span className="flex items-center">
                                  <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                                  {activity.duration} min
                                </span>
                              )}
                              
                              <span className="flex items-center">
                                <ApperIcon name="User" className="h-4 w-4 mr-1" />
                                {activity.createdBy}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
)}
    </div>
  )
}

export default function Activities() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (tab = 'activity') => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <ActivitiesContent onOpenModal={handleOpenModal} />
      <QuickAddModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultTab="activity"
      />
    </>
  )
}