import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import { dealService } from "@/services/api/dealService"
import { toast } from "react-toastify"

const DealDetailModal = ({ deal, contact, isOpen, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})

  const tabs = [
    { id: "overview", label: "Overview", icon: "Target" },
    { id: "activities", label: "Activities", icon: "Activity" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare" }
  ]

  const stages = [
    { id: "lead", name: "Lead" },
    { id: "qualified", name: "Qualified" },
    { id: "proposal", name: "Proposal" },
    { id: "negotiation", name: "Negotiation" },
    { id: "closed-won", name: "Closed Won" },
    { id: "closed-lost", name: "Closed Lost" }
  ]

  const handleEdit = () => {
    setFormData({
      name: deal.name,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate,
      description: deal.description
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedDeal = await dealService.update(deal.Id, formData)
      onUpdate(updatedDeal)
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update deal")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({})
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStageColor = (stage) => {
    const colors = {
      lead: "primary",
      qualified: "accent",
      proposal: "warning",
      negotiation: "danger",
      "closed-won": "success",
      "closed-lost": "secondary"
    }
    return colors[stage] || "default"
  }

  if (!deal) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl border border-secondary-200 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">{deal.name}</h2>
                  <p className="text-secondary-600">
                    {contact ? `${contact.firstName} ${contact.lastName} at ${contact.company}` : "Unknown Contact"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <>
                    <Button variant="secondary" size="sm" icon="Edit" onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon="Trash"
                      onClick={() => onDelete(deal.Id)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      icon="Save"
                      onClick={handleSave}
                      loading={loading}
                    >
                      Save
                    </Button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-secondary-500" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 border-b border-secondary-200">
              <div className="p-4 text-center border-r border-secondary-200">
                <div className="text-2xl font-bold text-secondary-900">
                  {formatCurrency(deal.value)}
                </div>
                <div className="text-sm text-secondary-600">Deal Value</div>
              </div>
              <div className="p-4 text-center border-r border-secondary-200">
                <div className="text-2xl font-bold text-secondary-900">
                  {deal.probability}%
                </div>
                <div className="text-sm text-secondary-600">Probability</div>
              </div>
              <div className="p-4 text-center border-r border-secondary-200">
                <Badge variant={getStageColor(deal.stage)} size="md">
                  {stages.find(s => s.id === deal.stage)?.name}
                </Badge>
                <div className="text-sm text-secondary-600 mt-1">Stage</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-lg font-semibold text-secondary-900">
                  {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-secondary-600">Expected Close</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-secondary-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 bg-primary-50"
                      : "border-transparent text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-6">
                      <FormField label="Deal Name" required>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </FormField>
                      <FormField label="Value" required>
                        <Input
                          type="number"
                          value={formData.value}
                          onChange={(e) => handleInputChange("value", parseFloat(e.target.value) || 0)}
                          icon="DollarSign"
                        />
                      </FormField>
                      <FormField label="Stage">
                        <Select
                          value={formData.stage}
                          onChange={(e) => handleInputChange("stage", e.target.value)}
                        >
                          {stages.map(stage => (
                            <option key={stage.id} value={stage.id}>
                              {stage.name}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                      <FormField label="Probability (%)">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.probability}
                          onChange={(e) => handleInputChange("probability", parseInt(e.target.value) || 0)}
                        />
                      </FormField>
                      <FormField label="Expected Close Date">
                        <Input
                          type="date"
                          value={formData.expectedCloseDate}
                          onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                        />
                      </FormField>
                      <FormField label="Description">
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Deal description..."
                          rows={4}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white hover:border-secondary-400"
                        />
                      </FormField>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-secondary-700">Description</label>
                        <div className="mt-2 text-secondary-900">
                          {deal.description || "No description provided."}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Created</label>
                          <div className="mt-1 text-secondary-900">
                            {new Date(deal.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Last Updated</label>
                          <div className="mt-1 text-secondary-900">
                            {new Date(deal.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Assigned To</label>
                          <div className="mt-1 text-secondary-900">{deal.assignedTo}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Currency</label>
                          <div className="mt-1 text-secondary-900">{deal.currency}</div>
                        </div>
                      </div>

                      {deal.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Tags</label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {deal.tags.map((tag, index) => (
                              <Badge key={index} variant="default" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "activities" && (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No Activities Yet</h3>
                  <p className="text-secondary-600 mb-4">Start logging activities for this deal to track progress.</p>
                  <Button icon="Plus" size="sm">Log Activity</Button>
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No Tasks Yet</h3>
                  <p className="text-secondary-600 mb-4">Add tasks to keep track of what needs to be done for this deal.</p>
                  <Button icon="Plus" size="sm">Add Task</Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DealDetailModal