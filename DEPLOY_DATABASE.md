# 🗄️ Configuração do Banco de Dados para Deploy

## Problema no Deploy

O erro que você está vendo acontece porque o projeto estava configurado para SQLite (desenvolvimento local), mas o Vercel precisa de PostgreSQL para produção.

```
Error: the URL must start with the protocol `file:`.
```

## ✅ Solução Implementada

1. **Schema atualizado** para PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Arquivo .env** configurado para PostgreSQL

## 🚀 Próximos Passos para Deploy

### 1. Configurar Banco PostgreSQL

Escolha uma das opções:

#### Opção A: Neon.tech (Recomendado)
1. Acesse https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a string de conexão

#### Opção B: Supabase
1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database
5. Copie a connection string

#### Opção C: Vercel Postgres
1. No dashboard da Vercel
2. Vá na aba "Storage"
3. Crie um Postgres database
4. Copie a connection string

### 2. Configurar Variáveis de Ambiente no Vercel

1. No dashboard da Vercel, acesse seu projeto
2. Vá em Settings > Environment Variables
3. Adicione:
   ```
   DATABASE_URL = sua_string_de_conexao_postgresql
   ```

### 3. Fazer Novo Deploy

1. Faça push das mudanças para o GitHub:
   ```bash
   git add .
   git commit -m "fix: configurar PostgreSQL para produção"
   git push origin master
   ```

2. O Vercel fará deploy automaticamente

## 🔧 Para Desenvolvimento Local

Se quiser continuar usando SQLite localmente:

1. Crie um arquivo `.env.local`:
   ```
   DATABASE_URL="file:./dev.db"
   ```

2. Execute:
   ```bash
   npm run db:push
   ```

## 📝 Exemplo de DATABASE_URL

```bash
# Neon
DATABASE_URL="postgresql://username:password@ep-abc123.us-east-2.aws.neon.tech/cardapio_digital?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres.xyz:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Vercel Postgres
DATABASE_URL="postgres://default:xyz@ep-abc123.us-east-1.postgres.vercel-storage.com:5432/verceldb"
```

## ⚠️ Importante

- **Nunca** commit o arquivo `.env` com credenciais reais
- Use o `.env.example` como referência
- Configure as variáveis diretamente no dashboard da Vercel
