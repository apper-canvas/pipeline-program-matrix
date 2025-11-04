import { motion } from "framer-motion"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const DealCard = ({ 
  deal, 
  contactName, 
  onClick, 
  onDragStart,
  isDragging 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return "text-success-600"
    if (probability >= 50) return "text-warning-600"
    if (probability >= 25) return "text-accent-600"
    return "text-secondary-600"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`deal-card cursor-pointer ${isDragging ? "drag-preview" : ""}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-secondary-900 text-sm leading-tight">
          {deal.name}
        </h4>
        <button className="p-1 hover:bg-secondary-100 rounded transition-colors">
          <ApperIcon name="MoreHorizontal" className="h-3 w-3 text-secondary-400" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-xs text-secondary-600">
          <ApperIcon name="User" className="h-3 w-3 mr-1" />
          {contactName}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-secondary-900">
            {formatCurrency(deal.value)}
          </span>
          <Badge 
            variant="secondary" 
            size="xs"
            className={getProbabilityColor(deal.probability)}
          >
            {deal.probability}%
          </Badge>
        </div>
        
        <div className="text-xs text-secondary-500">
          Due: {new Date(deal.expectedCloseDate).toLocaleDateString()}
        </div>
        
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {deal.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="default" size="xs">
                {tag}
              </Badge>
            ))}
            {deal.tags.length > 2 && (
              <Badge variant="secondary" size="xs">
                +{deal.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default DealCard