import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
class TaskService {
  constructor() {
    this.tableName = 'task_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        dueDate: task.due_date_c || new Date().toISOString().split('T')[0],
        priority: task.priority_c || 'medium',
        status: task.status_c || 'pending',
        assignedTo: task.assigned_to_c || '',
        contactId: task.contact_id_c?.Id || task.contact_id_c || null,
        dealId: task.deal_id_c?.Id || task.deal_id_c || null,
        completedAt: task.completed_at_c || null,
        tags: task.Tags ? task.Tags.split(',') : [],
        createdAt: task.CreatedOn || new Date().toISOString(),
        updatedAt: task.ModifiedOn || new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error in taskService.getAll:", error.message)
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success || !response.data) {
        throw new Error(`Task with id ${id} not found`)
      }

      const task = response.data
      return {
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        dueDate: task.due_date_c || new Date().toISOString().split('T')[0],
        priority: task.priority_c || 'medium',
        status: task.status_c || 'pending',
        assignedTo: task.assigned_to_c || '',
        contactId: task.contact_id_c?.Id || task.contact_id_c || null,
        dealId: task.deal_id_c?.Id || task.deal_id_c || null,
        completedAt: task.completed_at_c || null,
        tags: task.Tags ? task.Tags.split(',') : [],
        createdAt: task.CreatedOn || new Date().toISOString(),
        updatedAt: task.ModifiedOn || new Date().toISOString()
      }
    } catch (error) {
      console.error("Error in taskService.getById:", error.message)
      throw error
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) throw new Error('ApperClient not initialized')

      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || '',
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority || 'medium',
          status_c: taskData.status || 'pending',
          assigned_to_c: taskData.assignedTo || '',
          contact_id_c: taskData.contactId ? parseInt(taskData.contactId) : null,
          deal_id_c: taskData.dealId ? parseInt(taskData.dealId) : null
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error creating task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to create task: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Task creation failed')
    } catch (error) {
      console.error("Error in taskService.create:", error.message)
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
          Name: updateData.title,
          title_c: updateData.title,
          description_c: updateData.description,
          due_date_c: updateData.dueDate,
          priority_c: updateData.priority,
          status_c: updateData.status,
          assigned_to_c: updateData.assignedTo,
          contact_id_c: updateData.contactId ? parseInt(updateData.contactId) : undefined,
          deal_id_c: updateData.dealId ? parseInt(updateData.dealId) : undefined,
          completed_at_c: updateData.completedAt
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error updating task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to update task: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }
      
      throw new Error('Task update failed')
    } catch (error) {
      console.error("Error in taskService.update:", error.message)
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
        console.error("Error deleting task:", response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          const failedRecords = failed.map(f => f.message || 'Unknown error').join(', ')
          console.error(`Failed to delete task: ${failedRecords}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length === 1
      }
      
      return true
    } catch (error) {
      console.error("Error in taskService.delete:", error.message)
      return false
    }
  }

  async completeTask(id) {
    return this.update(id, { 
      status: 'completed', 
      completedAt: new Date().toISOString() 
    })
  }

  async getByStatus(status) {
    try {
      const tasks = await this.getAll()
      return tasks.filter(task => task.status === status)
    } catch (error) {
      console.error("Error in taskService.getByStatus:", error.message)
      return []
    }
  }

  async getOverdueTasks() {
    try {
      const tasks = await this.getAll()
      const today = new Date().toISOString().split('T')[0]
      return tasks.filter(task => 
        task.status === "pending" && task.dueDate < today
      )
    } catch (error) {
      console.error("Error in taskService.getOverdueTasks:", error.message)
      return []
    }
  }

  async getTodayTasks() {
    try {
      const tasks = await this.getAll()
      const today = new Date().toISOString().split('T')[0]
      return tasks.filter(task => 
        task.status === "pending" && task.dueDate === today
      )
    } catch (error) {
      console.error("Error in taskService.getTodayTasks:", error.message)
      return []
    }
  }
}

export const taskService = new TaskService()