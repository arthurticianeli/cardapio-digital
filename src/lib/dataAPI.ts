import { prisma } from './prisma'
import { Item, ItemFormData } from '@/types/item'
import { Menu, MenuFormData } from '@/types/menu'

// === ITEMS API ===
export const itemsAPI = {
  async getAll(): Promise<Item[]> {
    try {
      const items = await prisma.item.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return items
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
      return []
    }
  },

  async getById(id: string): Promise<Item | null> {
    try {
      const item = await prisma.item.findUnique({
        where: { id }
      })
      return item
    } catch (error) {
      console.error('Erro ao buscar item:', error)
      return null
    }
  },

  async create(data: ItemFormData): Promise<Item> {
    try {
      const newItem = await prisma.item.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          isActive: data.isActive
        }
      })
      return newItem
    } catch (error) {
      console.error('Erro ao criar item:', error)
      throw new Error('Falha ao criar item')
    }
  },

  async update(id: string, data: ItemFormData): Promise<Item | null> {
    try {
      const updatedItem = await prisma.item.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          isActive: data.isActive
        }
      })
      return updatedItem
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.item.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      return false
    }
  }
}

// === MENUS API ===
export const menusAPI = {
  async getAll(): Promise<Menu[]> {
    try {
      const menus = await prisma.menu.findMany({
        include: {
          menuItems: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return menus
    } catch (error) {
      console.error('Erro ao buscar menus:', error)
      return []
    }
  },

  async getById(id: string): Promise<Menu | null> {
    try {
      const menu = await prisma.menu.findUnique({
        where: { id },
        include: {
          menuItems: {
            orderBy: { order: 'asc' }
          }
        }
      })
      return menu
    } catch (error) {
      console.error('Erro ao buscar menu:', error)
      return null
    }
  },

  async create(data: MenuFormData): Promise<Menu> {
    try {
      const newMenu = await prisma.menu.create({
        data: {
          name: data.name,
          deliveryTax: data.deliveryTax,
          deliveryDay: data.deliveryDay,
          whatsappOrderDay: data.whatsappOrderDay,
          whatsappOrderTime: data.whatsappOrderTime,
          whatsappNumber: data.whatsappNumber,
          isActive: data.isActive,
          menuItems: {
            create: data.menuItems.map((item, index) => ({
              name: item.name,
              description: item.description,
              price: item.price,
              order: item.order || index,
              itemId: item.itemId // Incluir referência ao item original
            }))
          }
        },
        include: {
          menuItems: {
            orderBy: { order: 'asc' }
          }
        }
      })
      return newMenu
    } catch (error) {
      console.error('Erro ao criar menu:', error)
      throw new Error('Falha ao criar menu')
    }
  },

  async update(id: string, data: MenuFormData): Promise<Menu | null> {
    try {
      // Primeiro, deletar todos os menuItems existentes
      await prisma.menuItem.deleteMany({
        where: { menuId: id }
      })

      // Então atualizar o menu e recriar os menuItems
      const updatedMenu = await prisma.menu.update({
        where: { id },
        data: {
          name: data.name,
          deliveryTax: data.deliveryTax,
          deliveryDay: data.deliveryDay,
          whatsappOrderDay: data.whatsappOrderDay,
          whatsappOrderTime: data.whatsappOrderTime,
          whatsappNumber: data.whatsappNumber,
          isActive: data.isActive,
          menuItems: {
            create: data.menuItems.map((item, index) => ({
              name: item.name,
              description: item.description,
              price: item.price,
              order: item.order || index,
              itemId: item.itemId // Incluir referência ao item original
            }))
          }
        },
        include: {
          menuItems: {
            orderBy: { order: 'asc' }
          }
        }
      })
      return updatedMenu
    } catch (error) {
      console.error('Erro ao atualizar menu:', error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.menu.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error('Erro ao excluir menu:', error)
      return false
    }
  }
}
