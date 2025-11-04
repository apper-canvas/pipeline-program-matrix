import contactsData from "@/services/mockData/contacts.json"

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay()
    const contact = this.contacts.find(c => c.Id === parseInt(id))
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`)
    }
    return { ...contact }
  }

  async create(contactData) {
    await this.delay()
    const maxId = Math.max(...this.contacts.map(c => c.Id), 0)
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Contact with id ${id} not found`)
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Contact with id ${id} not found`)
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0]
    return { ...deletedContact }
  }

  async search(query) {
    await this.delay(200)
    const lowerQuery = query.toLowerCase()
    return this.contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.company.toLowerCase().includes(lowerQuery)
    )
  }

  async getByStatus(status) {
    await this.delay(200)
    return this.contacts.filter(contact => contact.status === status)
  }
}

export const contactService = new ContactService()