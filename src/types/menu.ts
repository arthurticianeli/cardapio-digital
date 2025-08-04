export interface MenuItem {
  id: string
  menuId: string
  itemId?: string | null  // Ajustado para aceitar null também
  name: string
  description: string
  price: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Menu {
  id: string
  name: string
  deliveryTax: number
  deliveryDay: string
  whatsappOrderDay: string
  whatsappOrderTime: string
  whatsappNumber: string
  menuItems: MenuItem[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MenuFormData {
  name: string
  deliveryTax: number
  deliveryDay: string
  whatsappOrderDay: string
  whatsappOrderTime: string
  whatsappNumber: string
  menuItems: MenuItem[]
  isActive: boolean
}
