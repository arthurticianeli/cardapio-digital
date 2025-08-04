# 🚀 Guia de Deploy na Vercel

## Passo a Passo Completo

### 1. Preparar o Banco de Dados PostgreSQL

#### Opção A: Neon (Recomendado - Gratuito)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a string de conexão `DATABASE_URL`

#### Opção B: Outras opções
- Supabase (gratuito)
- Railway (gratuito com limitações)
- PlanetScale (freemium)

### 2. Subir o Código para GitHub

```bash
# Se ainda não tem git inicializado
git init
git add .
git commit -m "feat: sistema completo de cardápio digital"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/cardapio-digital.git
git branch -M main
git push -u origin main
```

### 3. Deploy na Vercel

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Login**: Com sua conta GitHub
3. **Import Project**: Selecione o repositório `cardapio-digital`
4. **Configure Environment Variables**:
   ```
   DATABASE_URL=postgresql://username:password@host:5432/database
   NEXTAUTH_SECRET=uma_chave_secreta_aleatoria_de_32_caracteres
   NEXTAUTH_URL=https://seu-projeto.vercel.app
   ```

### 4. Variáveis de Ambiente Necessárias

#### DATABASE_URL
- String de conexão do PostgreSQL
- Exemplo: `postgresql://user:pass@ep-cool-lab-123456.us-east-1.aws.neon.tech/neondb`

#### NEXTAUTH_SECRET
- Chave secreta para autenticação
- Gere uma: `openssl rand -base64 32`
- Ou use: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

#### NEXTAUTH_URL
- URL completa da sua aplicação
- Exemplo: `https://cardapio-digital.vercel.app`

### 5. Processo de Build da Vercel

A Vercel executará automaticamente:

1. `npm install` - Instala dependências
2. `prisma generate` - Gera cliente Prisma
3. `prisma db push` - Aplica schema ao banco
4. `next build` - Constrói a aplicação
5. Deploy automático

### 6. Verificar Deploy

1. **Acesse a URL** fornecida pela Vercel
2. **Teste as funcionalidades**:
   - Gerenciar Itens
   - Criar Cardápio  
   - Pré-visualização
   - Download de imagem

### 7. Configurações Avançadas (Opcional)

#### Custom Domain
1. Vá em Project Settings → Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

#### Analytics
1. Ative Analytics no dashboard da Vercel
2. Monitore performance e uso

#### Environment Variables por Ambiente
- Production: Configurações de produção
- Preview: Para branches de desenvolvimento  
- Development: Para desenvolvimento local

### 8. Monitoramento

#### Logs
- Functions → View Function Logs
- Monitore erros em tempo real
- Configure alertas se necessário

#### Performance
- Analytics → Web Vitals
- Monitore Core Web Vitals
- Otimize conforme necessário

### 9. Troubleshooting

#### Build Errors
```bash
# Teste local antes do deploy
npm run build

# Verifique logs de build na Vercel
# Dashboard → Project → Functions → View Logs
```

#### Database Connection
```bash
# Teste conexão com banco
npx prisma db push --preview-feature

# Verifique variáveis de ambiente
echo $DATABASE_URL
```

#### Common Issues
1. **Prisma Client Error**: Verifique se `DATABASE_URL` está correta
2. **Build Timeout**: Otimize queries ou aumente timeout
3. **CORS Issues**: Configurado no middleware.ts

### 10. Manutenção

#### Updates
```bash
# Atualize dependências
npm update

# Commit e push para auto-deploy
git add .
git commit -m "chore: update dependencies"
git push
```

#### Database Migrations
```bash
# Para mudanças no schema
npx prisma db push

# Ou com migrations
npx prisma migrate deploy
```

## ✅ Checklist Final

- [ ] Banco PostgreSQL configurado
- [ ] Código no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] Aplicação funcionando
- [ ] Banco de dados conectado
- [ ] Funcionalidades testadas

## 🎉 Resultado

Sua aplicação estará disponível em:
`https://seu-projeto.vercel.app`

Com todas as funcionalidades:
- ✅ Interface administrativa
- ✅ Gerenciamento de itens
- ✅ Criação de cardápios
- ✅ Geração de imagens
- ✅ Banco de dados persistente
- ✅ Deploy automático
- ✅ HTTPS gratuito
- ✅ CDN global
