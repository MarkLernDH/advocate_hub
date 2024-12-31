interface DashboardStatsProps {
  stats: {
    total_advocates: number
    total_submissions: number
    pending_reviews: number
    total_points_awarded: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: 'Total Advocates',
      value: stats.total_advocates,
      description: 'Active advocates in the program'
    },
    {
      label: 'Total Submissions',
      value: stats.total_submissions,
      description: 'Submissions across all challenges'
    },
    {
      label: 'Pending Reviews',
      value: stats.pending_reviews,
      description: 'Submissions awaiting review'
    },
    {
      label: 'Points Awarded',
      value: stats.total_points_awarded,
      description: 'Total points distributed'
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border bg-white p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
          <p className="mt-2 text-3xl font-bold">{item.value}</p>
          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
