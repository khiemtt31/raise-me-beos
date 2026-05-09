export type ServerRuntimeEnv = {
  BASE_URL: string
  CORS_ORIGINS: string[]
  PAYOS_API_KEY: string
  PAYOS_CHECKSUM_KEY: string
  PAYOS_CLIENT_ID: string
  PAYOS_PARTNER_CODE?: string
  PAYMENT_SERVICE_PORT: number
  PORT: number
  SUPABASE_ANON_KEY?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  SUPABASE_URL: string
  NODE_ENV: string
}

type EnvSource = Partial<Record<keyof ServerRuntimeEnv, string | undefined>>

type PublicServerRuntimeEnv = Pick<ServerRuntimeEnv, 'BASE_URL' | 'CORS_ORIGINS' | 'NODE_ENV' | 'PAYMENT_SERVICE_PORT' | 'PORT'>

const DEFAULT_BASE_URL = 'http://localhost:3000'
const DEFAULT_CORS_ORIGINS = ['http://localhost:3000']
const DEFAULT_PORT = 4001

const getRequired = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing ${name}`)
  }

  return value
}

const getOptional = (value: string | undefined): string | undefined => {
  return value && value.length > 0 ? value : undefined
}

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_PORT
}

const parseOrigins = (value: string | undefined): string[] => {
  const origins = value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return origins && origins.length > 0 ? origins : DEFAULT_CORS_ORIGINS
}

const normalizeSource = (source?: EnvSource): EnvSource => source ?? {}

const read = (source: EnvSource, key: keyof ServerRuntimeEnv): string | undefined => {
  const value = source[key]
  return value && value.length > 0 ? value : undefined
}

const readProcessEnv = (key: keyof ServerRuntimeEnv): string | undefined => {
  return typeof process !== 'undefined' ? process.env[key] : undefined
}

export const getPublicRuntimeEnv = (context?: { env?: EnvSource }): PublicServerRuntimeEnv => {
  const source = normalizeSource(context?.env)

  return {
    BASE_URL: read(source, 'BASE_URL') ?? readProcessEnv('BASE_URL') ?? DEFAULT_BASE_URL,
    CORS_ORIGINS: parseOrigins(read(source, 'CORS_ORIGINS') ?? readProcessEnv('CORS_ORIGINS')),
    NODE_ENV: read(source, 'NODE_ENV') ?? readProcessEnv('NODE_ENV') ?? 'development',
    PAYMENT_SERVICE_PORT: parsePort(read(source, 'PAYMENT_SERVICE_PORT') ?? readProcessEnv('PAYMENT_SERVICE_PORT')),
    PORT: parsePort(read(source, 'PORT') ?? readProcessEnv('PORT')),
  }
}

export const getServerRuntimeEnv = (context?: { env?: EnvSource }): ServerRuntimeEnv => {
  const source = normalizeSource(context?.env)

  return {
    BASE_URL: read(source, 'BASE_URL') ?? readProcessEnv('BASE_URL') ?? DEFAULT_BASE_URL,
    CORS_ORIGINS: parseOrigins(read(source, 'CORS_ORIGINS') ?? readProcessEnv('CORS_ORIGINS')),
    PAYOS_API_KEY: getRequired(read(source, 'PAYOS_API_KEY') ?? readProcessEnv('PAYOS_API_KEY'), 'PAYOS_API_KEY'),
    PAYOS_CHECKSUM_KEY: getRequired(read(source, 'PAYOS_CHECKSUM_KEY') ?? readProcessEnv('PAYOS_CHECKSUM_KEY'), 'PAYOS_CHECKSUM_KEY'),
    PAYOS_CLIENT_ID: getRequired(read(source, 'PAYOS_CLIENT_ID') ?? readProcessEnv('PAYOS_CLIENT_ID'), 'PAYOS_CLIENT_ID'),
    PAYOS_PARTNER_CODE: read(source, 'PAYOS_PARTNER_CODE') ?? readProcessEnv('PAYOS_PARTNER_CODE'),
    PAYMENT_SERVICE_PORT: parsePort(read(source, 'PAYMENT_SERVICE_PORT') ?? readProcessEnv('PAYMENT_SERVICE_PORT')),
    PORT: parsePort(read(source, 'PORT') ?? readProcessEnv('PORT')),
    SUPABASE_ANON_KEY: read(source, 'SUPABASE_ANON_KEY') ?? readProcessEnv('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: read(source, 'SUPABASE_SERVICE_ROLE_KEY') ?? readProcessEnv('SUPABASE_SERVICE_ROLE_KEY'),
    SUPABASE_URL: getRequired(read(source, 'SUPABASE_URL') ?? readProcessEnv('SUPABASE_URL'), 'SUPABASE_URL'),
    NODE_ENV: read(source, 'NODE_ENV') ?? readProcessEnv('NODE_ENV') ?? 'development',
  }
}
