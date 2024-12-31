import Image from "next/image";
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // If user is authenticated, redirect to their appropriate dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const redirectPath = profile?.role === 'ADMIN' 
    ? '/admin/dashboard'
    : '/advocate/dashboard'

  redirect(redirectPath)
}
