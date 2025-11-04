import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import ContactDetailModal from "@/components/organisms/ContactDetailModal"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)

  const loadContacts = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await contactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    let filtered = [...contacts]

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.firstName.toLowerCase().includes(lowerSearch) ||
        contact.lastName.toLowerCase().includes(lowerSearch) ||
        contact.email.toLowerCase().includes(lowerSearch) ||
        contact.company.toLowerCase().includes(lowerSearch)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, statusFilter])

  const handleContactClick = (contact) => {
    setSelectedContact(contact)
    setShowContactModal(true)
  }

  const handleContactUpdate = (updatedContact) => {
    setContacts(prev => prev.map(c => 
      c.Id === updatedContact.Id ? updatedContact : c
    ))
    toast.success("Contact updated successfully!")
  }

  const handleContactDelete = async (contactId) => {
    try {
      await contactService.delete(contactId)
      setContacts(prev => prev.filter(c => c.Id !== contactId))
      setShowContactModal(false)
      toast.success("Contact deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete contact")
    }
  }

  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      qualified: "primary"
    }
    return variants[status] || "default"
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadContacts} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Contacts</h1>
          <p className="text-secondary-600 mt-1">Manage your customer relationships and contacts.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button icon="Download" variant="secondary" size="sm">
            Export
          </Button>
          <Button icon="UserPlus" size="sm">
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search contacts..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-32"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="qualified">Qualified</option>
            </Select>
            <Button variant="ghost" size="sm" icon="Filter">
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-secondary-600">
        <span>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </span>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-secondary-900">
            <ApperIcon name="Grid3X3" className="h-4 w-4" />
            <span>Grid</span>
          </button>
          <button className="flex items-center space-x-1 text-primary-600">
            <ApperIcon name="List" className="h-4 w-4" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description="No contacts match your current filters. Try adjusting your search criteria."
          icon="Users"
          actionLabel="Add Contact"
          onAction={() => toast.info("Add contact functionality would open here")}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="contact-row cursor-pointer"
                    onClick={() => handleContactClick(contact)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Avatar size="sm">
                          {getInitials(contact.firstName, contact.lastName)}
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">{contact.company}</div>
                      <div className="text-sm text-secondary-500">{contact.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(contact.status)} size="sm">
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {contact.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="default" size="xs">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="secondary" size="xs">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.info("Email functionality would open here")
                          }}
                          className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Mail" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.info("Phone functionality would open here")
                          }}
                          className="p-2 text-secondary-400 hover:text-success-500 hover:bg-success-50 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Phone" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContactClick(contact)
                          }}
                          className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                        >
                          <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setSelectedContact(null)
        }}
        onUpdate={handleContactUpdate}
        onDelete={handleContactDelete}
      />
    </div>
  )
}

export default Contacts