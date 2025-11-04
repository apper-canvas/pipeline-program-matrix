import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import FormField from "@/components/molecules/FormField"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"

const ContactDetailModal = ({ contact, isOpen, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "activities", label: "Activities", icon: "Activity" },
    { id: "deals", label: "Deals", icon: "Target" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare" }
  ]

  const handleEdit = () => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      title: contact.title,
      status: contact.status,
      source: contact.source
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedContact = await contactService.update(contact.Id, formData)
      onUpdate(updatedContact)
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update contact")
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

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      qualified: "primary"
    }
    return variants[status] || "default"
  }

  if (!contact) return null

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
                <Avatar size="lg">
                  {getInitials(contact.firstName, contact.lastName)}
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    {contact.firstName} {contact.lastName}
                  </h2>
                  <p className="text-secondary-600">{contact.title} at {contact.company}</p>
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
                      onClick={() => onDelete(contact.Id)}
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
                      <FormField label="First Name" required>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </FormField>
                      <FormField label="Last Name" required>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </FormField>
                      <FormField label="Email" required>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          icon="Mail"
                        />
                      </FormField>
                      <FormField label="Phone">
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          icon="Phone"
                        />
                      </FormField>
                      <FormField label="Company">
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          icon="Building"
                        />
                      </FormField>
                      <FormField label="Title">
                        <Input
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                        />
                      </FormField>
                      <FormField label="Status">
                        <Select
                          value={formData.status}
                          onChange={(e) => handleInputChange("status", e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="qualified">Qualified</option>
                        </Select>
                      </FormField>
                      <FormField label="Source">
                        <Select
                          value={formData.source}
                          onChange={(e) => handleInputChange("source", e.target.value)}
                        >
                          <option value="website">Website</option>
                          <option value="referral">Referral</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="cold-call">Cold Call</option>
                          <option value="conference">Conference</option>
                        </Select>
                      </FormField>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Email</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <ApperIcon name="Mail" className="h-4 w-4 text-secondary-400" />
                            <span className="text-secondary-900">{contact.email}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Phone</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <ApperIcon name="Phone" className="h-4 w-4 text-secondary-400" />
                            <span className="text-secondary-900">{contact.phone || "Not provided"}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Company</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <ApperIcon name="Building" className="h-4 w-4 text-secondary-400" />
                            <span className="text-secondary-900">{contact.company}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Status</label>
                          <div className="mt-1">
                            <Badge variant={getStatusVariant(contact.status)}>
                              {contact.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Source</label>
                          <div className="mt-1">
                            <span className="text-secondary-900 capitalize">{contact.source}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Tags</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {contact.tags.map((tag, index) => (
                              <Badge key={index} variant="default" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "activities" && (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No Activities Yet</h3>
                  <p className="text-secondary-600 mb-4">Start engaging with this contact to see activity history here.</p>
                  <Button icon="Plus" size="sm">Log Activity</Button>
                </div>
              )}

              {activeTab === "deals" && (
                <div className="text-center py-8">
                  <ApperIcon name="Target" className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No Deals Yet</h3>
                  <p className="text-secondary-600 mb-4">Create a deal for this contact to start tracking opportunities.</p>
                  <Button icon="Plus" size="sm">Create Deal</Button>
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No Tasks Yet</h3>
                  <p className="text-secondary-600 mb-4">Add tasks related to this contact to stay organized.</p>
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

export default ContactDetailModal