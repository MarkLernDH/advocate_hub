import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// In a real application, this data would be fetched from an API
const challenges = [
  {
    id: 1,
    title: "Write a Product Review",
    description: "Share your experience with our product on your blog or social media.",
    points: 100,
    deadline: "2023-12-31",
  },
  {
    id: 2,
    title: "Attend a Webinar",
    description: "Participate in our upcoming product webinar and provide feedback.",
    points: 50,
    deadline: "2023-11-30",
  },
  // Add more challenges as needed
]

export default function Challenges() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Challenges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{challenge.description}</p>
              <p className="mb-2"><strong>Points:</strong> {challenge.points}</p>
              <p className="mb-4"><strong>Deadline:</strong> {challenge.deadline}</p>
              <Link href={`/challenges/${challenge.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

