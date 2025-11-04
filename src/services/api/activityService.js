import activitiesData from "@/services/mockData/activities.json"

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await this.delay()
    const activity = this.activities.find(a => a.Id === parseInt(id))
    if (!activity) {
      throw new Error(`Activity with id ${id} not found`)
    }
    return { ...activity }
  }

  async create(activityData) {
    await this.delay()
    const maxId = Math.max(...this.activities.map(a => a.Id), 0)
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Activity with id ${id} not found`)
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...updateData
    }
    return { ...this.activities[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Activity with id ${id} not found`)
    }
    
    const deletedActivity = this.activities.splice(index, 1)[0]
    return { ...deletedActivity }
  }

  async getByContact(contactId) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.contactId === contactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getByDeal(dealId) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.dealId === dealId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getByType(type) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getRecent(limit = 10) {
    await this.delay(200)
    return [...this.activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }
}

export const activityService = new ActivityService()