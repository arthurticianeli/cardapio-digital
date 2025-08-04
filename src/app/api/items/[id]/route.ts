import { NextResponse } from 'next/server'
import { ItemFormData } from '@/types/item'
import { itemsAPI } from '@/lib/dataAPI'

// GET - Buscar item por ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const item = await itemsAPI.getById(id)
    
    if (!item) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao buscar item:', error)
    return NextResponse.json({ error: 'Erro ao buscar item' }, { status: 500 })
  }
}

// PUT - Atualizar item
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body: ItemFormData = await request.json()
    const updatedItem = await itemsAPI.update(id, body)

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Erro ao atualizar item:', error)
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
  }
}

// DELETE - Excluir item
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const success = await itemsAPI.delete(id)

    if (!success) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Item excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir item:', error)
    return NextResponse.json({ error: 'Erro ao excluir item' }, { status: 500 })
  }
}