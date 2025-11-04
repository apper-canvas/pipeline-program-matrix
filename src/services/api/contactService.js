import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class ContactService {
  constructor() {
    this.tableName = 'contact_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching contacts:", response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(contact => ({
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        title: contact.title_c || '',
        status: contact.status_c || 'active',
        source: contact.source_c || 'manual',
        assignedTo: contact.assigned_to_c || '',
        tags: contact.tags_c ? contact.tags_c.split(',') : [],
        createdAt: contact.CreatedOn || new Date().toISOString(),
        updatedAt: contact.ModifiedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error in contactService.getAll:", error.message)
      return []
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success || !response.data) {
        throw new Error(`Contact with id ${id} not found`)
      }

      const contact = response.data
      return {
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        title: contact.title_c || '',
        status: contact.status_c || 'active',
        source: contact.source_c || 'manual',
        assignedTo: contact.assigned_to_c || '',
        tags: contact.tags_c ? contact.tags_c.split(',') : [],
        createdAt: contact.CreatedOn || new Date().toISOString(),
        updatedAt: contact.ModifiedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error("Error in contactService.getById:", error.message)
      throw error
    }
  }

  async create(contactData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        records: [{
          Name: `${contactData.firstName} ${contactData.lastName}`,
          first_name_c: contactData.firstName,
          last_name_c: contactData.lastName,
          email_c: contactData.email,
          phone_c: contactData.phone || '',
          company_c: contactData.company || '',
          title_c: contactData.title || '',
          status_c: contactData.status || 'active',
          source_c: contactData.source || 'manual',
          assigned_to_c: contactData.assignedTo || '',
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : ''
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error creating contact:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to create contact: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Contact creation failed')
    } catch (error) {
      console.error("Error in contactService.create:", error.message)
      throw error
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.firstName && updateData.lastName ? 
            `${updateData.firstName} ${updateData.lastName}` : undefined,
          first_name_c: updateData.firstName,
          last_name_c: updateData.lastName,
          email_c: updateData.email,
          phone_c: updateData.phone,
          company_c: updateData.company,
          title_c: updateData.title,
          status_c: updateData.status,
          source_c: updateData.source,
          assigned_to_c: updateData.assignedTo,
          tags_c: Array.isArray(updateData.tags) ? updateData.tags.join(',') : updateData.tags
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error updating contact:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to update contact: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Contact update failed')
    } catch (error) {
      console.error("Error in contactService.update:", error.message)
      throw error
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error deleting contact:", response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to delete contact: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length === 1
      }
      
      return true
    } catch (error) {
      console.error("Error in contactService.delete:", error.message)
      return false
    }
  }

  async search(query) {
    try {
      const contacts = await this.getAll()
      const lowerQuery = query.toLowerCase()
      return contacts.filter(contact => 
        contact.firstName.toLowerCase().includes(lowerQuery) ||
        contact.lastName.toLowerCase().includes(lowerQuery) ||
        contact.email.toLowerCase().includes(lowerQuery) ||
        contact.company.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error("Error in contactService.search:", error.message)
      return []
    }
  }

  async getByStatus(status) {
    try {
      const contacts = await this.getAll()
      return contacts.filter(contact => contact.status === status)
    } catch (error) {
      console.error("Error in contactService.getByStatus:", error.message)
      return []
    }
  }
}

export const contactService = new ContactService()