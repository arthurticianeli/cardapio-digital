#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando configuração para deploy...\n')

// Verificar arquivos essenciais
const essentialFiles = [
  'package.json',
  'next.config.js',
  'vercel.json',
  'prisma/schema.prisma',
  'src/lib/prisma.ts',
  '.env.example',
  'README.md',
  'DEPLOY.md'
]

let allFilesExist = true

essentialFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - AUSENTE`)
    allFilesExist = false
  }
})

console.log('\n📦 Verificando package.json...')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

// Verificar scripts essenciais
const requiredScripts = ['build', 'start', 'postinstall']
const hasAllScripts = requiredScripts.every(script => packageJson.scripts[script])

if (hasAllScripts) {
  console.log('✅ Scripts de build configurados')
} else {
  console.log('❌ Scripts de build incompletos')
  allFilesExist = false
}

// Verificar dependências essenciais
const requiredDeps = ['@prisma/client', 'prisma', 'next', 'react']
const hasAllDeps = requiredDeps.every(dep => 
  packageJson.dependencies[dep] || packageJson.devDependencies[dep]
)

if (hasAllDeps) {
  console.log('✅ Dependências principais presentes')
} else {
  console.log('❌ Dependências principais ausentes')
  allFilesExist = false
}

console.log('\n🗄️ Verificando configuração do Prisma...')

const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8')
if (schemaContent.includes('provider = "postgresql"')) {
  console.log('✅ Prisma configurado para PostgreSQL')
} else {
  console.log('❌ Prisma não configurado para PostgreSQL')
  allFilesExist = false
}

console.log('\n⚙️ Verificando arquivos de configuração...')

// Verificar next.config.js
if (fs.existsSync('next.config.js')) {
  console.log('✅ next.config.js presente')
} else {
  console.log('❌ next.config.js ausente')
  allFilesExist = false
}

// Verificar vercel.json
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json presente')
} else {
  console.log('❌ vercel.json ausente')
  allFilesExist = false
}

console.log('\n📝 Resumo:')

if (allFilesExist) {
  console.log('🎉 TUDO PRONTO PARA DEPLOY!')
  console.log('\n📋 Próximos passos:')
  console.log('1. Criar banco PostgreSQL (Neon, Supabase, etc.)')
  console.log('2. Subir código para GitHub')
  console.log('3. Importar projeto na Vercel')
  console.log('4. Configurar variáveis de ambiente:')
  console.log('   - DATABASE_URL')
  console.log('   - NEXTAUTH_SECRET')
  console.log('   - NEXTAUTH_URL')
  console.log('5. Fazer deploy!')
  console.log('\n📖 Consulte DEPLOY.md para instruções detalhadas.')
} else {
  console.log('❌ CONFIGURAÇÃO INCOMPLETA')
  console.log('Corrija os itens marcados com ❌ antes do deploy.')
}

console.log('\n🔗 Links úteis:')
console.log('• Neon (PostgreSQL gratuito): https://neon.tech')
console.log('• Vercel (Deploy): https://vercel.com')
console.log('• GitHub: https://github.com')
console.log('• Gerar SECRET: https://generate-secret.vercel.app/32')
