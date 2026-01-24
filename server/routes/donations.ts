import { Router } from 'express'
import { supabase } from '../services/supabase'

const router = Router()

// Get all donations (public)
router.get('/public', async (req, res) => {
  try {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, amount, message, senderName:sender_name, createdAt:created_at')
      .eq('status', 'PAID')
      .eq('isAnonymous', false)
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