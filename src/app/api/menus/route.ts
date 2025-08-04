import { NextRequest, NextResponse } from 'next/server'
import { MenuFormData } from '@/types/menu'
import { menusAPI } from '@/lib/dataAPI'

export async function GET() {
  try {
    const menus = await menusAPI.getAll()
    // Retorna o cardápio único (sempre o primeiro ou null se não existir)
    const currentMenu = menus.length > 0 ? menus[0] : null
    
    return NextResponse.json(currentMenu)
  } catch (error) {
    console.error('Erro ao buscar cardápio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MenuFormData = await request.json()
    
    // Validação básica
    if (!body.name || !body.deliveryDay || !body.whatsappOrderDay || !body.whatsappOrderTime) {
      return NextResponse.json(
        { error: 'Campos obrigatórios estão faltando' },
        { status: 400 }
      )
    }

    if (!body.menuItems || !Array.isArray(body.menuItems) || body.menuItems.length === 0) {
      return NextResponse.json(
        { error: 'É necessário ter pelo menos um item no cardápio' },
        { status: 400 }
      )
    }

    const menus = await menusAPI.getAll()

    // Se já existe um menu, atualiza ele, senão cria um novo
    let savedMenu
    if (menus.length > 0) {
      savedMenu = await menusAPI.update(menus[0].id, body)
    } else {
      savedMenu = await menusAPI.create(body)
    }

    return NextResponse.json(savedMenu, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar cardápio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
