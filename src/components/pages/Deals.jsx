import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import DealDetailModal from "@/components/organisms/DealDetailModal";
import DealCard from "@/components/organisms/DealCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
const [viewMode, setViewMode] = useState("kanban") // kanban or list
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [showDealModal, setShowDealModal] = useState(false)
  const [showQuickAddModal, setShowQuickAddModal] = useState(false)
  const [draggedDeal, setDraggedDeal] = useState(null)

  const stages = [
    { id: "lead", name: "Lead", color: "bg-primary-50 border-primary-200" },
    { id: "qualified", name: "Qualified", color: "bg-accent-50 border-accent-200" },
    { id: "proposal", name: "Proposal", color: "bg-warning-50 border-warning-200" },
    { id: "negotiation", name: "Negotiation", color: "bg-danger-50 border-danger-200" },
    { id: "closed-won", name: "Closed Won", color: "bg-success-50 border-success-200" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-secondary-50 border-secondary-200" }
  ]

  const loadDeals = async () => {
    try {
      setError("")
      setLoading(true)
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const handleDealClick = (deal) => {
    setSelectedDeal(deal)
    setShowDealModal(true)
  }

  const handleDealUpdate = (updatedDeal) => {
    setDeals(prev => prev.map(d => 
      d.Id === updatedDeal.Id ? updatedDeal : d
    ))
    toast.success("Deal updated successfully!")
  }

  const handleDealDelete = async (dealId) => {
    try {
      await dealService.delete(dealId)
      setDeals(prev => prev.filter(d => d.Id !== dealId))
      setShowDealModal(false)
      toast.success("Deal deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete deal")
    }
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, targetStage) => {
    e.preventDefault()
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null)
      return
    }

    try {
      const updatedDeal = await dealService.updateStage(draggedDeal.Id, targetStage)
      handleDealUpdate(updatedDeal)
      toast.success(`Deal moved to ${stages.find(s => s.id === targetStage)?.name}`)
    } catch (err) {
      toast.error("Failed to update deal stage")
    } finally {
      setDraggedDeal(null)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

const getContactName = (contactId) => {
  if (!contactId) return "Unknown"
  const contact = contacts.find(c => c.Id?.toString() === contactId?.toString())
  return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown"
}

  const renderKanbanView = () => {
    if (deals.length === 0) {
      return (
        <Empty
          title="No deals found"
          description="Start adding deals to see your sales pipeline here."
          icon="Target"
          actionLabel="Add Deal"
          onAction={() => toast.info("Add deal functionality would open here")}
        />
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage.id)
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)

          return (
            <div
              key={stage.id}
              className={`pipeline-column ${stage.color} border-2`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">{stage.name}</h3>
                <Badge variant="secondary" size="xs">
                  {stageDeals.length}
                </Badge>
              </div>
              <div className="text-xs text-secondary-600 mb-4">
                {formatCurrency(stageValue)}
              </div>
              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.Id}
                    deal={deal}
                    contactName={getContactName(deal.contactId)}
                    onClick={() => handleDealClick(deal)}
                    onDragStart={(e) => handleDragStart(e, deal)}
                    isDragging={draggedDeal?.Id === deal.Id}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderListView = () => {
    if (deals.length === 0) {
      return (
        <Empty
          title="No deals found"
          description="Start adding deals to see your sales pipeline here."
          icon="Target"
          actionLabel="Add Deal"
          onAction={() => toast.info("Add deal functionality would open here")}
        />
      )
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Probability
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Close Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {deals.map((deal, index) => {
                const stage = stages.find(s => s.id === deal.stage)
                return (
                  <motion.tr
                    key={deal.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="contact-row cursor-pointer"
                    onClick={() => handleDealClick(deal)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {deal.name}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {deal.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {getContactName(deal.contactId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {formatCurrency(deal.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="default" size="sm">
                        {stage?.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {deal.probability}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(deal.expectedCloseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDealClick(deal)
                        }}
                        className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (loading) return <Loading type="pipeline" />
  if (error) return <Error message={error} onRetry={loadDeals} />

  const totalPipelineValue = deals
    .filter(d => !["closed-won", "closed-lost"].includes(d.stage))
    .reduce((sum, deal) => sum + deal.value, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Deals</h1>
          <p className="text-secondary-600 mt-1">
            Manage your sales pipeline • Total value: {formatCurrency(totalPipelineValue)}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-white text-secondary-900 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <ApperIcon name="Columns" className="h-4 w-4 mr-2 inline" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-secondary-900 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <ApperIcon name="List" className="h-4 w-4 mr-2 inline" />
              List
            </button>
</div>
          <Button 
            icon="Plus" 
            size="sm"
            onClick={() => setShowQuickAddModal(true)}
          >
            Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline View */}
      {viewMode === "kanban" ? renderKanbanView() : renderListView()}

      {/* Deal Detail Modal */}
      <DealDetailModal
deal={selectedDeal}
      contact={selectedDeal?.contactId ? contacts.find(c => c.Id?.toString() === selectedDeal.contactId?.toString()) : null}
      isOpen={showDealModal}
        onClose={() => {
          setShowDealModal(false)
          setSelectedDeal(null)
        }}
        onUpdate={handleDealUpdate}
onDelete={handleDealDelete}
      />

{/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAddModal}
        onClose={() => {
          setShowQuickAddModal(false)
          loadDeals() // Refresh deals list after creation
        }}
      />
    </div>
  )
}

export default Deals