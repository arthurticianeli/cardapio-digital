import { prisma } from '@/lib/prisma'

export async function initializeDatabase() {
  try {
    // Tenta conectar ao banco
    await prisma.$connect()
    
    // Verifica se as tabelas existem criando uma consulta simples
    const itemsCount = await prisma.item.count()
    const menusCount = await prisma.menu.count()
    
    console.log(`✅ Banco conectado - ${itemsCount} itens, ${menusCount} menus`)
    
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error)
    return false
  }
}

export async function seedDatabase() {
  try {
    // Criar alguns itens de exemplo se não existirem
    const itemsCount = await prisma.item.count()
    
    if (itemsCount === 0) {
      console.log('🌱 Criando dados iniciais...')
      
      await prisma.item.createMany({
        data: [
          {
            name: 'Hambúrguer Clássico',
            description: 'Hambúrguer artesanal com queijo, alface, tomate e molho especial',
            price: 25.90,
            isActive: true
          },
          {
            name: 'Pizza Margherita',
            description: 'Molho de tomate, mussarela, manjericão fresco e azeitona',
            price: 35.50,
            isActive: true
          },
          {
            name: 'Refrigerante Lata',
            description: 'Coca-Cola, Pepsi, Guaraná ou Sprite - 350ml',
            price: 5.00,
            isActive: true
          }
        ]
      })
      
      console.log('✅ Dados iniciais criados')
    }
    
    return true
  } catch (error) {
    console.error('❌ Erro ao criar dados iniciais:', error)
    return false
  }
}
