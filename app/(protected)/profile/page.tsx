import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookieStore = cookies()
          return Array.from(cookieStore.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            // This won't actually set cookies in a server component,
            // but we need to provide the method
          })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="mt-1">{session.user.email}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Name</h2>
            <p className="mt-1">{userData?.name || 'Not set'}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Member Since</h2>
            <p className="mt-1">
              {new Date(session.user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}