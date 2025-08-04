# 🚀 CARDÁPIO DIGITAL - DEPLOY VERCEL

## ✅ STATUS ATUAL
- **Aplicação**: Funcional em desenvolvimento
- **Banco de dados**: Convertido para PostgreSQL
- **Configuração**: 100% pronta para deploy
- **Testes**: APIs funcionando perfeitamente

## 📋 PASSOS PARA DEPLOY

### 1. 🗄️ Criar Banco PostgreSQL
```bash
# Opção 1: Neon (Recomendado)
1. Acesse: https://neon.tech
2. Crie conta gratuita
3. Crie novo projeto
4. Copie a connection string

# Opção 2: Supabase
1. Acesse: https://supabase.com
2. Crie conta gratuita  
3. Crie novo projeto
4. Vá em Settings > Database
5. Copie a connection string
```

### 2. 📤 Push para GitHub
```bash
# Se ainda não tem repositório:
git init
git add .
git commit -m "Deploy ready - cardápio digital"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cardapio-digital.git
git push -u origin main

# Se já tem repositório:
git add .
git commit -m "Deploy configuration complete"
git push
```

### 3. 🌐 Deploy na Vercel
```bash
1. Acesse: https://vercel.com
2. Conecte sua conta GitHub
3. Clique "New Project"
4. Selecione o repositório cardapio-digital
5. Configure as variáveis de ambiente:
   - DATABASE_URL: sua_connection_string_postgresql
   - NEXTAUTH_SECRET: gere_uma_chave_secreta_forte
   - NEXTAUTH_URL: https://seu-projeto.vercel.app
6. Clique "Deploy"
```

### 4. 🔧 Variáveis de Ambiente Necessárias
```env
# No painel da Vercel, adicione:
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="sua-chave-secreta-muito-forte-aqui"  
NEXTAUTH_URL="https://seu-projeto.vercel.app"
```

## 🛠️ CONFIGURAÇÕES CRIADAS

### Arquivos de Deploy
- ✅ `vercel.json` - Configuração da Vercel
- ✅ `next.config.js` - Otimizações Next.js
- ✅ `middleware.ts` - CORS e headers
- ✅ `prisma/schema.prisma` - Schema PostgreSQL

### Scripts Adicionados
- ✅ `postinstall` - Gera Prisma client
- ✅ `db:push` - Sincroniza schema
- ✅ `db:migrate` - Migrations
- ✅ `db:studio` - Interface visual

### Funcionalidades
- ✅ Auto-inicialização do banco
- ✅ Seeding automático de dados
- ✅ CORS configurado
- ✅ Error handling robusto
- ✅ Otimizações de performance

## 🎯 APÓS O DEPLOY

### Verificar Funcionamento
1. Acesse sua URL da Vercel
2. Teste criação de cardápio
3. Teste adição de itens
4. Teste edição e exclusão

### Monitoramento
- Dashboard Vercel: analytics e logs
- Banco PostgreSQL: métricas de uso
- Performance: Web Vitals automático

## 🆘 TROUBLESHOOTING

### Erro de Conexão com Banco
```bash
# Verifique se DATABASE_URL está correta
# Certifique-se que o banco permite conexões externas
# Teste a connection string localmente
```

### Erro de Build
```bash
# Verifique se todas as dependências estão no package.json
# Limpe cache: npm run clean (se disponível)
# Verifique logs no dashboard Vercel
```

### Erro de Prisma
```bash
# Prisma Client é gerado automaticamente
# Se houver erro, force regeneração no dashboard Vercel
# Redeploy pode resolver problemas de schema
```

## 📞 SUPORTE
- Documentação oficial: [DEPLOY.md](./DEPLOY.md)
- Logs detalhados: Dashboard Vercel > Functions
- Status da API: https://seu-projeto.vercel.app/api/health

---
**🎉 Sua aplicação está 100% pronta para deploy!**
