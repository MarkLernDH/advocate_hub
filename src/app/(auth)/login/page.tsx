import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import LoginForm from '@/components/auth/LoginForm'
import { paths } from '@/lib/navigation'
import { UserRole } from '@/types'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    // Check user role to determine redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const redirectPath = profile?.role === UserRole.ADMIN 
      ? paths.dashboard.admin
      : paths.dashboard.advocate

    return redirect(searchParams.redirectTo || redirectPath)
  }

  return <LoginForm redirectTo={searchParams.redirectTo} />
}
