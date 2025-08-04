import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearMenus() {
  console.log('🧹 Limpando menus existentes...')

  // Deletar todos os menus (menuItems serão deletados automaticamente por CASCADE)
  await prisma.menu.deleteMany({})

  console.log('✅ Menus limpos com sucesso!')
  console.log('🔄 Agora você pode criar um novo cardápio do zero para testar a persistência.')
}

clearMenus()
  .catch((e) => {
    console.error('❌ Erro ao limpar menus:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
