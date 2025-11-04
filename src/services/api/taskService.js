import tasksData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error(`Task with id ${id} not found`)
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0)
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`)
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updateData
    }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`)
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0]
    return { ...deletedTask }
  }

  async completeTask(id) {
    await this.delay()
    return this.update(id, { 
      status: "completed", 
      completedAt: new Date().toISOString() 
    })
  }

  async getByStatus(status) {
    await this.delay(200)
    return this.tasks.filter(task => task.status === status)
  }

  async getOverdueTasks() {
    await this.delay(200)
    const today = new Date().toISOString().split('T')[0]
    return this.tasks.filter(task => 
      task.status === "pending" && task.dueDate < today
    )
  }

  async getTodayTasks() {
    await this.delay(200)
    const today = new Date().toISOString().split('T')[0]
    return this.tasks.filter(task => 
      task.status === "pending" && task.dueDate === today
    )
  }
}

export const taskService = new TaskService()