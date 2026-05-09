import { Hono } from 'hono'
import type { DonationHistoryQueryDTO, DonationHistoryResponseDTO } from '../../types/api.js'
import { supabase } from '../services/supabase.js'
import { DonationStatus } from '../utils/donation-status.js'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 6
const MAX_LIMIT = 50

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.floor(parsed)
}

const buildPagination = (page: number, limit: number, total: number) => {
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: totalPages > 0 ? page < totalPages : false,
    hasPrevPage: page > 1,
  }
}

const donationsRoutes = new Hono()

donationsRoutes.get('/public', async (c) => {
  try {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, amount, message, senderName:sender_name, createdAt:created_at')
      .eq('status', DonationStatus.SUCCESS)
      .eq('is_anonymous', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Get public donations error:', error)
      return c.json({ error: 'Failed to get donations' }, 500)
    }

    return c.json({ donations })
  } catch (error) {
    console.error('Get public donations error:', error)
    return c.json({ error: 'Failed to get donations' }, 500)
  }
})

donationsRoutes.get('/history', async (c) => {
  try {
    const pageQuery = c.req.query('page')
    const limitQuery = c.req.query('limit')
    const query = {
      page: pageQuery ? Number(pageQuery) : undefined,
      limit: limitQuery ? Number(limitQuery) : undefined,
    } satisfies DonationHistoryQueryDTO

    const page = parsePositiveInt(query.page, DEFAULT_PAGE)
    const limit = Math.min(parsePositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('donations')
      .select('id, amount, message, senderName:sender_name, createdAt:created_at, status, isAnonymous:is_anonymous', {
        count: 'exact',
      })
      .eq('status', DonationStatus.SUCCESS)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Get donation history error:', error)
      return c.json({ error: 'Failed to get donation history' }, 500)
    }

    const total = count ?? 0
    const pagination = buildPagination(page, limit, total)

    const response: DonationHistoryResponseDTO = {
      data:
        data?.map((donation) => ({
          ...donation,
          senderName: donation.isAnonymous ? null : donation.senderName ?? null,
          method: 'PayOS',
        })) ?? [],
      pagination,
    }

    return c.json(response)
  } catch (error) {
    console.error('Get donation history error:', error)
    return c.json({ error: 'Failed to get donation history' }, 500)
  }
})

donationsRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const { data: donation, error } = await supabase
      .from('donations')
      .select(`
        *,
        user:users (
          fullName:full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error || !donation) {
      return c.json({ error: 'Donation not found' }, 404)
    }

    return c.json({ donation })
  } catch (error) {
    console.error('Get donation error:', error)
    return c.json({ error: 'Failed to get donation' }, 500)
  }
})

export { buildPagination, parsePositiveInt }
export default donationsRoutes
