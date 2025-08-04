/**
 * Configurações de produção para Vercel
 * Este arquivo garante que o banco de dados funcione corretamente no deploy
 */

// Configuração de timeout para conexões lentas
export const maxDuration = 30

// Headers CORS para API
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Configuração de retry para operações de banco
export const retryConfig = {
  retries: 3,
  delay: 1000,
}

// Configuração do Prisma para produção
export const prismaConfig = {
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}

// Headers de cache para assets estáticos
export const cacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable',
}

// Configuração de rate limiting (se necessário)
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela
}

export default {
  maxDuration,
  corsHeaders,
  retryConfig,
  prismaConfig,
  cacheHeaders,
  rateLimitConfig,
}
