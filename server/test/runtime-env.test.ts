import { describe, expect, it, vi } from 'vitest'

import { getPublicRuntimeEnv, getServerRuntimeEnv } from '../utils/runtime-env.js'

describe('runtime env helpers', () => {
  it('reads public runtime env from bindings', () => {
    const env = getPublicRuntimeEnv({
      env: {
        BASE_URL: 'https://example.com',
        CORS_ORIGINS: 'https://a.com, https://b.com',
        NODE_ENV: 'production',
        PAYMENT_SERVICE_PORT: '8080',
        PORT: '9090',
      },
    })

    expect(env).toEqual({
      BASE_URL: 'https://example.com',
      CORS_ORIGINS: ['https://a.com', 'https://b.com'],
      NODE_ENV: 'production',
      PAYMENT_SERVICE_PORT: 8080,
      PORT: 9090,
    })
  })

  it('requires secret runtime env values', () => {
    vi.stubEnv('PAYOS_CLIENT_ID', 'client')
    vi.stubEnv('PAYOS_API_KEY', 'api')
    vi.stubEnv('PAYOS_CHECKSUM_KEY', 'checksum')
    vi.stubEnv('SUPABASE_URL', 'https://supabase.example.com')

    const env = getServerRuntimeEnv({
      env: {
        PAYOS_CLIENT_ID: 'client',
        PAYOS_API_KEY: 'api',
        PAYOS_CHECKSUM_KEY: 'checksum',
        SUPABASE_URL: 'https://supabase.example.com',
      },
    })

    expect(env.PAYOS_CLIENT_ID).toBe('client')
    expect(env.PAYOS_API_KEY).toBe('api')
    expect(env.PAYOS_CHECKSUM_KEY).toBe('checksum')
    expect(env.SUPABASE_URL).toBe('https://supabase.example.com')
  })
})
