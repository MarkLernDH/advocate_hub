'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// In a real application, this data would be fetched from an API
const initialProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  company: "Acme Inc.",
  jobTitle: "Product Manager",
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile)
  const [editing, setEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log('Updated profile:', profile)
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <Input
                type="text"
                id="company"
                name="company"
                value={profile.company}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1"
              />
            </div>
            {editing ? (
              <Button type="submit">Save Changes</Button>
            ) : (
              <Button type="button" onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

