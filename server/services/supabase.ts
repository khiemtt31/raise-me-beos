import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getServerRuntimeEnv } from '../utils/runtime-env.js'

let cachedSupabase: SupabaseClient | null = null

const createSupabaseClient = () => {
  const env = getServerRuntimeEnv()
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY

  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase URL or Service Role Key')
  }

  return createClient(env.SUPABASE_URL, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  })
}

export const getSupabase = () => {
  if (!cachedSupabase) {
    cachedSupabase = createSupabaseClient()
  }

  return cachedSupabase
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase()
    const value = client[prop as keyof SupabaseClient]
    return typeof value === 'function' ? value.bind(client) : value
  },
}) as SupabaseClient
