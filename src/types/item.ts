export interface Item {
  id: string
  name: string
  description: string
  price: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ItemFormData = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>
