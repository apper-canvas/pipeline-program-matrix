import dealsData from "@/services/mockData/deals.json"

class DealService {
  constructor() {
    this.deals = [...dealsData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.deals]
  }

  async getById(id) {
    await this.delay()
    const deal = this.deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error(`Deal with id ${id} not found`)
    }
    return { ...deal }
  }

  async create(dealData) {
    await this.delay()
    const maxId = Math.max(...this.deals.map(d => d.Id), 0)
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Deal with id ${id} not found`)
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.deals[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Deal with id ${id} not found`)
    }
    
    const deletedDeal = this.deals.splice(index, 1)[0]
    return { ...deletedDeal }
  }

  async getByStage(stage) {
    await this.delay(200)
    return this.deals.filter(deal => deal.stage === stage)
  }

  async getPipelineData() {
    await this.delay(200)
    const stages = ["lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"]
    const pipeline = {}
    
    stages.forEach(stage => {
      pipeline[stage] = this.deals.filter(deal => deal.stage === stage)
    })
    
    return pipeline
  }

  async updateStage(id, newStage) {
    await this.delay()
    return this.update(id, { stage: newStage })
  }
}

export const dealService = new DealService()