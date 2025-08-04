import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Populando banco de dados...')

  // Criar itens de exemplo
  const items = await Promise.all([
    prisma.item.create({
      data: {
        name: 'Feijoada Completa',
        description: 'Feijoada tradicional com arroz, couve, farofa e laranja',
        price: 28.90,
        isActive: true
      }
    }),
    prisma.item.create({
      data: {
        name: 'Lasanha à Bolonhesa',
        description: 'Lasanha caseira com molho bolonhesa e queijo',
        price: 24.50,
        isActive: true
      }
    }),
    prisma.item.create({
      data: {
        name: 'Parmegiana de Frango',
        description: 'Filé empanado com molho e queijo, acompanha arroz e batata frita',
        price: 32.00,
        isActive: true
      }
    }),
    prisma.item.create({
      data: {
        name: 'Strogonoff de Carne',
        description: 'Strogonoff cremoso com batata palha e arroz',
        price: 26.90,
        isActive: true
      }
    }),
    prisma.item.create({
      data: {
        name: 'Salmão Grelhado',
        description: 'Salmão grelhado com legumes salteados e purê de batata',
        price: 38.00,
        isActive: true
      }
    })
  ])

  console.log(`✅ Criados ${items.length} itens de exemplo`)
  console.log('🎉 Banco de dados populado com sucesso!')
}

seed()
  .catch((e) => {
    console.error('❌ Erro ao popular banco:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
