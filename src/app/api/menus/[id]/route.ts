import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        menuItems: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { name, deliveryTax, deliveryDay, whatsappOrderDay, whatsappOrderTime, whatsappNumber, menuItems } = body

    // First delete existing menu items
    await prisma.menuItem.deleteMany({
      where: { menuId: id }
    })

    // Then update menu with new items
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        deliveryTax: parseFloat(deliveryTax),
        deliveryDay,
        whatsappOrderDay,
        whatsappOrderTime,
        whatsappNumber,
        menuItems: {
          create: menuItems.map((item: { name: string; description: string; price: string }, index: number) => ({
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            order: index
          }))
        }
      },
      include: {
        menuItems: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error updating menu:', error)
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await prisma.menu.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Menu deleted successfully' })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 })
  }
}
