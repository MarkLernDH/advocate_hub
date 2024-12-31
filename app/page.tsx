import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/utils'

export default async function Home() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Let middleware handle the role-based redirect
  return null
}