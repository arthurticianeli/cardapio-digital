#!/bin/bash

echo "🚀 Preparando aplicação para deploy..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production=false

# Gerar cliente Prisma
echo "🔄 Gerando cliente Prisma..."
npx prisma generate --schema=./prisma/schema.prisma

# Build da aplicação
echo "🏗️ Fazendo build da aplicação..."
npm run build

echo "✅ Aplicação pronta para deploy!"
