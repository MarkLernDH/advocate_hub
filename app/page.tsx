import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  // In a real application, this data would be fetched from an API
  const advocateData = {
    name: "John Doe",
    points: 1250,
    level: "Gold",
    completedChallenges: 15,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {advocateData.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{advocateData.points}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{advocateData.level}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{advocateData.completedChallenges}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl">250 points to next level</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

