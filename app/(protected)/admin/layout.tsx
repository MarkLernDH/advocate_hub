import { Sidebar } from '@/components/admin/Sidebar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'Manage your advocacy program',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
