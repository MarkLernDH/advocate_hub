import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/utils'
import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user role
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single()

  // Redirect based on role
  if (data?.role === 'ADMIN') {
    redirect('/admin/dashboard')
  } else {
    redirect('/advocate/dashboard')
  }
}