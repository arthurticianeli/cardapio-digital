import { NextResponse } from 'next/server'
import { ItemFormData } from '@/types/item'
import { itemsAPI } from '@/lib/dataAPI'
import { initializeDatabase, seedDatabase } from '@/lib/database-init'

// GET - Listar itens
export async function GET() {
  try {
    // Inicializar banco se necessário
    const dbConnected = await initializeDatabase()
    if (!dbConnected) {
      return NextResponse.json({ error: 'Erro de conexão com banco de dados' }, { status: 500 })
    }
    
    const items = await itemsAPI.getAll()
    
    // Se não há itens, criar dados iniciais
    if (items.length === 0) {
      await seedDatabase()
      const seededItems = await itemsAPI.getAll()
      return NextResponse.json(seededItems)
    }
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Erro ao buscar itens:', error)
    return NextResponse.json({ error: 'Erro ao buscar itens' }, { status: 500 })
  }
}

// POST - Criar novo item
export async function POST(request: Request) {
  try {
    const body: ItemFormData = await request.json()
    const newItem = await itemsAPI.create(body)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar item:', error)
    return NextResponse.json({ error: 'Erro ao criar item' }, { status: 500 })
  }
}
