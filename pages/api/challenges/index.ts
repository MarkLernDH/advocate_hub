import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabaseClient'
import { Challenge } from '../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')

    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json(challenges)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}