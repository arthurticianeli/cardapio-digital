# Gerador de Cardápio Digital

Este é um sistema completo para criar cardápios digitais automatizados para restaurantes.

## Funcionalidades

- Painel administrativo para criar e gerenciar cardápios
- Sistema de geração de imagens PNG/JPG para divulgação
- Layout responsivo que se adapta ao número de itens do menu
- Pré-visualização em tempo real do cardápio
- Campos configuráveis para:
  - Taxa de entrega
  - Dia da semana para entrega
  - Dia e hora limite para pedidos via WhatsApp
  - Número do WhatsApp
  - Lista de pratos com descrição e preços

## Tecnologias

- **Frontend**: Next.js 14 com App Router
- **Styling**: Tailwind CSS
- **Banco de dados**: PostgreSQL com Prisma ORM
- **Geração de imagens**: HTML5 Canvas
- **Deployment**: Vercel + Neon (PostgreSQL)

## Estrutura do Projeto

- `/src/app/api/menus/` - API routes para CRUD de cardápios
- `/src/components/MenuForm.tsx` - Formulário para criar/editar cardápios
- `/src/components/MenuCanvas.tsx` - Componente para renderizar e gerar imagens
- `/src/types/menu.ts` - Tipos TypeScript para cardápios
- `/prisma/schema.prisma` - Schema do banco de dados

## Como usar

1. Acesse a aba "Criar Cardápio"
2. Preencha as informações do restaurante e itens do menu
3. Use "Pré-visualizar" para ver como ficará o cardápio
4. Salve o cardápio e baixe a imagem PNG gerada
5. Gerencie cardápios salvos na aba "Gerenciar Cardápios"

## Customização

- A imagem de fundo deve ser colocada em `/public/fundo.jpg`
- O layout se adapta automaticamente ao número de itens
- Cores e estilos podem ser customizados no componente MenuCanvas
