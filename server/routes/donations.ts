import { Router } from 'express'
import type { DonationHistoryQueryDTO, DonationHistoryResponseDTO } from '../../types/api'
import { supabase } from '../services/supabase'

const router = Router()

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

// Get all donations (public)
router.get('/public', async (req, res) => {
  try {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, amount, message, senderName:sender_name, createdAt:created_at')
      .eq('status', 'PAID')
      .eq('is_anonymous', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Get public donations error:', error)
      return res.status(500).json({ error: 'Failed to get donations' })
    }

    return res.json({ donations })
  } catch (error) {
    console.error('Get public donations error:', error)
    return res.status(500).json({ error: 'Failed to get donations' })
  }
})

// Get donation history (paginated)
router.get('/history', async (req, res) => {
  try {
    const { page: pageQuery, limit: limitQuery } = req.query as DonationHistoryQueryDTO
    const page = parsePositiveInt(pageQuery, DEFAULT_PAGE)
    const limit = Math.min(parsePositiveInt(limitQuery, DEFAULT_LIMIT), MAX_LIMIT)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('donations')
      .select(
        'id, amount, message, senderName:sender_name, createdAt:created_at, status, isAnonymous:is_anonymous',
        { count: 'exact' }
      )
      .eq('status', 'PAID')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Get donation history error:', error)
      return res.status(500).json({ error: 'Failed to get donation history' })
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

    return res.json(response)
  } catch (error) {
    console.error('Get donation history error:', error)
    return res.status(500).json({ error: 'Failed to get donation history' })
  }
})

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

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
      return res.status(404).json({ error: 'Donation not found' })
    }

    return res.json({ donation })
  } catch (error) {
    console.error('Get donation error:', error)
    return res.status(500).json({ error: 'Failed to get donation' })
  }
})

export default router
