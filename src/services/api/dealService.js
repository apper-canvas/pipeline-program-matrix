import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class DealService {
  constructor() {
    this.tableName = 'deal_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching deals:", response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        name: deal.name_c || deal.Name || '',
        value: parseFloat(deal.value_c) || 0,
        currency: deal.currency_c || 'USD',
        stage: deal.stage_c || 'lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c || new Date().toISOString().split('T')[0],
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        companyId: deal.company_id_c || '',
        assignedTo: deal.assigned_to_c || '',
        tags: deal.tags_c ? deal.tags_c.split(',') : [],
        description: deal.description_c || '',
        createdAt: deal.CreatedOn || new Date().toISOString(),
        updatedAt: deal.ModifiedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error in dealService.getAll:", error.message)
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success || !response.data) {
        throw new Error(`Deal with id ${id} not found`)
      }

      const deal = response.data
      return {
        Id: deal.Id,
        name: deal.name_c || deal.Name || '',
        value: parseFloat(deal.value_c) || 0,
        currency: deal.currency_c || 'USD',
        stage: deal.stage_c || 'lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c || new Date().toISOString().split('T')[0],
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        companyId: deal.company_id_c || '',
        assignedTo: deal.assigned_to_c || '',
        tags: deal.tags_c ? deal.tags_c.split(',') : [],
        description: deal.description_c || '',
        createdAt: deal.CreatedOn || new Date().toISOString(),
        updatedAt: deal.ModifiedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error("Error in dealService.getById:", error.message)
      throw error
    }
  }

  async create(dealData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        records: [{
          Name: dealData.name,
          name_c: dealData.name,
          value_c: parseFloat(dealData.value) || 0,
          currency_c: dealData.currency || 'USD',
          stage_c: dealData.stage || 'lead',
          probability_c: parseInt(dealData.probability) || 0,
          expected_close_date_c: dealData.expectedCloseDate,
          contact_id_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          company_id_c: dealData.companyId || '',
          assigned_to_c: dealData.assignedTo || '',
          tags_c: Array.isArray(dealData.tags) ? dealData.tags.join(',') : '',
          description_c: dealData.description || ''
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error creating deal:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to create deal: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Deal creation failed')
    } catch (error) {
      console.error("Error in dealService.create:", error.message)
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
          Name: updateData.name,
          name_c: updateData.name,
          value_c: updateData.value !== undefined ? parseFloat(updateData.value) : undefined,
          currency_c: updateData.currency,
          stage_c: updateData.stage,
          probability_c: updateData.probability !== undefined ? parseInt(updateData.probability) : undefined,
          expected_close_date_c: updateData.expectedCloseDate,
          contact_id_c: updateData.contactId ? parseInt(updateData.contactId) : undefined,
          company_id_c: updateData.companyId,
          assigned_to_c: updateData.assignedTo,
          tags_c: Array.isArray(updateData.tags) ? updateData.tags.join(',') : updateData.tags,
          description_c: updateData.description
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error updating deal:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to update deal: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Deal update failed')
    } catch (error) {
      console.error("Error in dealService.update:", error.message)
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
        console.error("Error deleting deal:", response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to delete deal: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length === 1
      }
      
      return true
    } catch (error) {
      console.error("Error in dealService.delete:", error.message)
      return false
    }
  }

  async getByStage(stage) {
    try {
      const deals = await this.getAll()
      return deals.filter(deal => deal.stage === stage)
    } catch (error) {
      console.error("Error in dealService.getByStage:", error.message)
      return []
    }
  }

  async getPipelineData() {
    try {
      const deals = await this.getAll()
      const stages = ["lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"]
      const pipeline = {}
      
      stages.forEach(stage => {
        pipeline[stage] = deals.filter(deal => deal.stage === stage)
      })
      
      return pipeline
    } catch (error) {
      console.error("Error in dealService.getPipelineData:", error.message)
      return {}
    }
  }

  async updateStage(id, newStage) {
    return this.update(id, { stage: newStage })
  }
}

export const dealService = new DealService()