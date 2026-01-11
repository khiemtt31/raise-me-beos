import { Router } from 'express'
import { supabase } from '../services/supabase'

const router = Router()

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Create user in our database
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        })

      if (insertError) {
        console.error('Failed to create user in database:', insertError)
      }
    }

    return res.json({ user: data.user, session: data.session })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Failed to sign up' })
  }
})

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.json({ user: data.user, session: data.session })
  } catch (error) {
    console.error('Signin error:', error)
    return res.status(500).json({ error: 'Failed to sign in' })
  }
})

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error('Signout error:', error)
    return res.status(500).json({ error: 'Failed to sign out' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: authData, error: authError } = await supabase.auth.getUser(token)

    if (authError) {
      return res.status(401).json({ error: authError.message })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        donations (*),
        notifications:notifications!user_id (*)
      `)
      .eq('id', authData.user.id)
      .eq('notifications.is_read', false)
      .order('created_at', { foreignTable: 'notifications', ascending: false })
      .single()

    if (userError) {
      console.error('Get user error:', userError)
      return res.status(500).json({ error: 'Failed to get user' })
    }

    return res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router