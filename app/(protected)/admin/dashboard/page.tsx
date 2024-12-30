import { Metadata } from 'next'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your advocacy program',
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Challenges</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500 mt-1">Total active challenges</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Advocates</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500 mt-1">Registered advocates</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500 mt-1">Submissions awaiting review</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Advocates</h3>
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">No advocates yet</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
