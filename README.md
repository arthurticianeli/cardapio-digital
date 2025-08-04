# 🍽️ Gerador de Cardápio Digital

Sistema completo desenvolvido em Next.js para criar cardápios digitais automatizados para restaurantes. Permite que funcionários alimentem informações através de um painel administrativo e gerem imagens PNG/JPG profissionais para divulgação.

## 🚀 Deploy na Vercel

### Pré-requisitos
1. Conta na [Vercel](https://vercel.com)
2. Conta no [Neon](https://neon.tech) ou outro provedor PostgreSQL
3. Repositório GitHub com o código

### Passos para Deploy

#### 1. Configurar Banco de Dados
1. **Para produção (Vercel)**: Crie um banco PostgreSQL
   - **Neon.tech** (recomendado): https://neon.tech - gratuito com até 10GB
   - **Supabase**: https://supabase.com - gratuito com até 500MB
   - **Vercel Postgres**: Disponível no dashboard da Vercel
2. Copie a string de conexão `DATABASE_URL` (exemplo: `postgresql://user:pass@host:5432/db`)

#### 2. Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub
2. Importe este repositório
3. **Configure as variáveis de ambiente** no dashboard da Vercel:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/database
   ```
4. **Importante**: Certifique-se de que o arquivo `prisma/schema.prisma` esteja configurado para PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

#### 3. Build e Deploy Automático
- A Vercel executará automaticamente o processo de build configurado

## ✨ Funcionalidades

- **Painel Administrativo**: Interface intuitiva para criar e gerenciar cardápios
- **Geração de Imagens**: Criação automática de imagens PNG/JPG para divulgação
- **Layout Responsivo**: Adaptação automática baseada no número de itens do menu
- **Pré-visualização**: Visualização em tempo real antes de salvar
- **Campos Configuráveis**:
  - Nome do cardápio
  - Taxa de entrega
  - Dia da semana para entrega
  - Dia e horário limite para pedidos via WhatsApp  
  - Número do WhatsApp
  - Lista completa de pratos com descrição e preços

## 🚀 Tecnologias

- **Frontend**: Next.js 14 com App Router e TypeScript
- **Styling**: Tailwind CSS
- **Banco de dados**: PostgreSQL com Prisma ORM
- **Geração de imagens**: HTML5 Canvas
- **Deployment**: Vercel + Neon (PostgreSQL)

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/
│   │   ├── api/menus/          # API routes para CRUD de cardápios
│   │   └── page.tsx            # Página principal com tabs
│   ├── components/
│   │   ├── MenuForm.tsx        # Formulário para criar/editar cardápios
│   │   └── MenuCanvas.tsx      # Componente para renderizar e gerar imagens
│   ├── types/
│   │   └── menu.ts             # Tipos TypeScript para cardápios
│   └── lib/
│       └── db.ts               # Configuração do Prisma
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
└── public/
    └── fundo.jpg               # Imagem de fundo (substituir pela real)
```

## 🛠️ Como usar

### 1. Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd cardapio-digital

# Instale as dependências
npm install

# Configure o banco (opcional para desenvolvimento local)
npx prisma migrate dev
```

### 2. Execução

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### 3. Uso da aplicação

1. **Criar Cardápio**: 
   - Acesse a aba "Criar Cardápio"
   - Preencha informações do restaurante e itens do menu
   - Use "Pré-visualizar" para ver o resultado

2. **Gerar Imagem**:
   - Na pré-visualização, clique em "Baixar Imagem PNG"
   - A imagem será baixada automaticamente

3. **Gerenciar**:
   - Use a aba "Gerenciar Cardápios" para ver cardápios salvos
   - Edite ou visualize cardápios existentes

## 🎨 Customização

### Imagem de Fundo
- Coloque sua imagem de fundo em `/public/fundo.jpg` 
- Formato recomendado: 1280x1277px
- O layout se adapta automaticamente

### Estilos
- Edite `src/components/MenuCanvas.tsx` para personalizar cores e fontes
- Modifique `src/components/MenuForm.tsx` para ajustar o formulário
- Use Tailwind CSS para estilos da interface

### Layout
- O sistema é responsivo e centraliza automaticamente os itens
- Suporta qualquer quantidade de pratos
- Layout otimizado para redes sociais

## 🗄️ Banco de Dados

### Modelos

**Menu**
- `id`: Identificador único
- `name`: Nome do cardápio
- `deliveryTax`: Taxa de entrega
- `deliveryDay`: Dia da semana para entrega
- `whatsappOrderDay`: Dia para pedidos WhatsApp
- `whatsappOrderTime`: Horário limite pedidos
- `whatsappNumber`: Número do WhatsApp
- `isActive`: Status ativo/inativo
- `createdAt/updatedAt`: Timestamps

**MenuItem**
- `id`: Identificador único
- `name`: Nome do prato
- `description`: Descrição do prato
- `price`: Preço
- `order`: Ordem de exibição
- `menuId`: Referência ao menu

## 🚀 Deploy

### Vercel + Neon
1. Faça push para o GitHub
2. Conecte seu repositório na Vercel
3. Configure as variáveis de ambiente:
   ```
   DATABASE_URL="sua-string-postgresql-neon"
   ```
4. Deploy automático!

### Outras plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js e PostgreSQL.

## 📝 API Endpoints

- `GET /api/menus` - Lista todos os cardápios
- `POST /api/menus` - Cria novo cardápio
- `GET /api/menus/[id]` - Busca cardápio específico
- `PUT /api/menus/[id]` - Atualiza cardápio
- `DELETE /api/menus/[id]` - Remove cardápio

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ para automatizar a criação de cardápios digitais!
