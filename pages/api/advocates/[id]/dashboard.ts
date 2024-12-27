import type { NextApiRequest, NextApiResponse } from 'next'
import { Advocate } from '../../../../types'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query
    // TODO: Fetch advocate data from database
    const advocate: Partial<Advocate> = { id: id as string, name: 'John Doe', points: 100 }
    res.status(200).json(advocate)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

