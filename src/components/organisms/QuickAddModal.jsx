import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import { toast } from "react-toastify"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { taskService } from "@/services/api/taskService"

const QuickAddModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("contact")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Contact fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    
    // Deal fields
    dealName: "",
    value: "",
    stage: "lead",
    
    // Task fields
    taskTitle: "",
    description: "",
    dueDate: "",
    priority: "medium"
  })

  const tabs = [
    { id: "contact", label: "Contact", icon: "User" },
    { id: "deal", label: "Deal", icon: "Target" },
    { id: "task", label: "Task", icon: "CheckSquare" }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      dealName: "",
      value: "",
      stage: "lead",
      taskTitle: "",
      description: "",
      dueDate: "",
      priority: "medium"
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === "contact") {
        await contactService.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          title: formData.title,
          status: "active",
          source: "manual",
          assignedTo: "John Parker",
          tags: [],
          customFields: {}
        })
        toast.success("Contact created successfully!")
      } else if (activeTab === "deal") {
        await dealService.create({
          name: formData.dealName,
          value: parseFloat(formData.value) || 0,
          currency: "USD",
          stage: formData.stage,
          probability: formData.stage === "lead" ? 10 : 25,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          contactId: "1",
          companyId: "1",
          assignedTo: "John Parker",
          tags: [],
          description: ""
        })
        toast.success("Deal created successfully!")
      } else if (activeTab === "task") {
        await taskService.create({
          title: formData.taskTitle,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          status: "pending",
          assignedTo: "John Parker",
          contactId: "1",
          dealId: null
        })
        toast.success("Task created successfully!")
      }

      resetForm()
      onClose()
    } catch (error) {
      toast.error("Failed to create item. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderContactForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" required>
          <Input
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="John"
          />
        </FormField>
        <FormField label="Last Name" required>
          <Input
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Smith"
          />
        </FormField>
      </div>
      <FormField label="Email" required>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="john@company.com"
          icon="Mail"
        />
      </FormField>
      <FormField label="Phone">
        <Input
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="+1 (555) 123-4567"
          icon="Phone"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Company">
          <Input
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Company Name"
            icon="Building"
          />
        </FormField>
        <FormField label="Title">
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Job Title"
          />
        </FormField>
      </div>
    </div>
  )

  const renderDealForm = () => (
    <div className="space-y-4">
      <FormField label="Deal Name" required>
        <Input
          value={formData.dealName}
          onChange={(e) => handleInputChange("dealName", e.target.value)}
          placeholder="Acme Corp - Website Redesign"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Value" required>
          <Input
            type="number"
            value={formData.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            placeholder="50000"
            icon="DollarSign"
          />
        </FormField>
        <FormField label="Stage">
          <Select
            value={formData.stage}
            onChange={(e) => handleInputChange("stage", e.target.value)}
          >
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </Select>
        </FormField>
      </div>
    </div>
  )

  const renderTaskForm = () => (
    <div className="space-y-4">
      <FormField label="Task Title" required>
        <Input
          value={formData.taskTitle}
          onChange={(e) => handleInputChange("taskTitle", e.target.value)}
          placeholder="Follow up with client"
        />
      </FormField>
      <FormField label="Description">
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Task description..."
          rows={3}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white hover:border-secondary-400"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Due Date">
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
        </FormField>
        <FormField label="Priority">
          <Select
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>
      </div>
    </div>
  )

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
            className="relative bg-white rounded-xl shadow-xl border border-secondary-200 w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Quick Add</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-secondary-500" />
              </button>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {activeTab === "contact" && renderContactForm()}
              {activeTab === "deal" && renderDealForm()}
              {activeTab === "task" && renderTaskForm()}

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-secondary-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  icon="Plus"
                >
                  Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default QuickAddModal