import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class ActivityService {
  constructor() {
    this.tableName = 'activity_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "created_by_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching activities:", response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        description: activity.description_c || '',
        duration: parseInt(activity.duration_c) || 0,
        outcome: activity.outcome_c || '',
        subject: activity.subject_c || activity.Name || '',
        timestamp: activity.timestamp_c || activity.CreatedOn || new Date().toISOString(),
        type: activity.type_c || 'note',
        createdBy: activity.created_by_c || '',
        tags: activity.Tags ? activity.Tags.split(',') : [],
        createdAt: activity.CreatedOn || new Date().toISOString(),
        updatedAt: activity.ModifiedOn || new Date().toISOString()
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error("Error in activityService.getAll:", error.message)
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "created_by_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success || !response.data) {
        throw new Error(`Activity with id ${id} not found`)
      }

      const activity = response.data
      return {
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null,
        description: activity.description_c || '',
        duration: parseInt(activity.duration_c) || 0,
        outcome: activity.outcome_c || '',
        subject: activity.subject_c || activity.Name || '',
        timestamp: activity.timestamp_c || activity.CreatedOn || new Date().toISOString(),
        type: activity.type_c || 'note',
        createdBy: activity.created_by_c || '',
        tags: activity.Tags ? activity.Tags.split(',') : [],
        createdAt: activity.CreatedOn || new Date().toISOString(),
        updatedAt: activity.ModifiedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error("Error in activityService.getById:", error.message)
      throw error
    }
  }

  async create(activityData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const timestamp = activityData.date ? 
        new Date(activityData.date).toISOString() : 
        new Date().toISOString()

      const params = {
        records: [{
          Name: activityData.subject || activityData.type || 'Activity',
          contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null,
          description_c: activityData.description || '',
          duration_c: parseInt(activityData.duration) || 0,
          outcome_c: activityData.outcome || '',
          subject_c: activityData.subject || '',
          timestamp_c: timestamp,
          type_c: activityData.type || 'note',
          created_by_c: activityData.createdBy || activityData.assignedTo || ''
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error creating activity:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to create activity: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Activity creation failed')
    } catch (error) {
      console.error("Error in activityService.create:", error.message)
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
          Name: updateData.subject,
          contact_id_c: updateData.contactId ? parseInt(updateData.contactId) : undefined,
          deal_id_c: updateData.dealId ? parseInt(updateData.dealId) : undefined,
          description_c: updateData.description,
          duration_c: updateData.duration !== undefined ? parseInt(updateData.duration) : undefined,
          outcome_c: updateData.outcome,
          subject_c: updateData.subject,
          timestamp_c: updateData.timestamp,
          type_c: updateData.type,
          created_by_c: updateData.createdBy
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error updating activity:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to update activity: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Activity update failed')
    } catch (error) {
      console.error("Error in activityService.update:", error.message)
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
        console.error("Error deleting activity:", response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to delete activity: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length === 1
      }
      
      return true
    } catch (error) {
      console.error("Error in activityService.delete:", error.message)
      return false
    }
  }

  async getByContact(contactId) {
    try {
      const activities = await this.getAll()
      return activities.filter(activity => 
        activity.contactId?.toString() === contactId?.toString()
      )
    } catch (error) {
      console.error("Error in activityService.getByContact:", error.message)
      return []
    }
  }

  async getByDeal(dealId) {
    try {
      const activities = await this.getAll()
      return activities.filter(activity => 
        activity.dealId?.toString() === dealId?.toString()
      )
    } catch (error) {
      console.error("Error in activityService.getByDeal:", error.message)
      return []
    }
  }

  async getByType(type) {
    try {
      const activities = await this.getAll()
      return activities.filter(activity => activity.type === type)
    } catch (error) {
      console.error("Error in activityService.getByType:", error.message)
      return []
    }
  }

  async getRecent(limit = 10) {
    try {
      const activities = await this.getAll()
      return activities.slice(0, limit)
    } catch (error) {
      console.error("Error in activityService.getRecent:", error.message)
      return []
    }
  }
}

export const activityService = new ActivityService()