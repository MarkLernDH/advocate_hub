import { useAuth } from '@/lib/supabase/context'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">AdvocacyHub</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
