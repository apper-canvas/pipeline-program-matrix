import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";

const QuickAddModal = ({ isOpen, onClose, defaultTab = "contact", onTaskCreated }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loading, setLoading] = useState(false)
  
  // Contacts for assignment
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(false)
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
      console.error("Error creating item:", error)
      toast.error(`Failed to create ${activeTab}`)
    } finally {
      setLoading(false)
    }
  }

  // Load contacts for task assignment
  useEffect(() => {
    if (isOpen && activeTab === "task") {
      loadContacts()
    }
  }, [isOpen, activeTab])

  const loadContacts = async () => {
    try {
      setContactsLoading(true)
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (error) {
      console.error("Failed to load contacts:", error)
    } finally {
      setContactsLoading(false)
    }
  }

// Set active tab when modal opens with default
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
    }
  }, [isOpen, defaultTab])
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Quick Add</h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <div className="flex mb-6 bg-secondary-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "contact"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-secondary-600"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "task"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-secondary-600"
            }`}
            onClick={() => setActiveTab("task")}
          >
            Task
          </button>
        </div>

{activeTab === "contact" && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" required>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="John"
                    required
                  />
                </FormField>
                <FormField label="Last Name" required>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Smith"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Email" required>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </FormField>

              <FormField label="Phone">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Company">
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Company Name"
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

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Contact"}
              </Button>
            </div>
          </form>
        )}

{activeTab === "deal" && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField label="Deal Name" required>
                <Input
                  value={formData.dealName}
                  onChange={(e) => handleInputChange("dealName", e.target.value)}
                  placeholder="Acme Corp - Website Redesign"
                  required
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Value" required>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder="50000"
                    required
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

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Deal"}
              </Button>
            </div>
          </form>
        )}

        {activeTab === "task" && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField label="Task Title" required>
                <Input
                  value={formData.taskTitle}
                  onChange={(e) => handleInputChange("taskTitle", e.target.value)}
                  placeholder="Follow up with client"
                  required
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

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
)
}

export default QuickAddModal