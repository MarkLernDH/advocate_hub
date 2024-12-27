'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// In a real application, this data would be fetched from an API based on the challenge ID
const challenge = {
  id: 1,
  title: "Write a Product Review",
  description: "Share your experience with our product on your blog or social media.",
  points: 100,
  deadline: "2023-12-31",
  instructions: [
    "Write a detailed review of at least 500 words",
    "Include at least one photo of you using the product",
    "Share the link to your blog post or social media update",
  ],
}

export default function ChallengeDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // In a real application, you would send this data to your API
    const formData = new FormData()
    formData.append('challengeId', params.id)
    formData.append('link', link)
    if (file) {
      formData.append('file', file)
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitting(false)
    router.push('/challenges')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{challenge.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{challenge.description}</p>
          <p className="mb-2"><strong>Points:</strong> {challenge.points}</p>
          <p className="mb-4"><strong>Deadline:</strong> {challenge.deadline}</p>
          <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
          <ul className="list-disc pl-5 mb-4">
            {challenge.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Link to your submission
              </label>
              <Input
                type="url"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Upload a file (optional)
              </label>
              <Input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Challenge'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

