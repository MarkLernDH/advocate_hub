'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Submission {
  id: number
  advocateName: string
  challengeTitle: string
  submissionDate: string
  status: string
}

// Mock data for submissions
const mockSubmissions: Submission[] = [
  { id: 1, advocateName: 'John Doe', challengeTitle: 'Write a Product Review', submissionDate: '2023-06-01', status: 'Pending' },
  { id: 2, advocateName: 'Jane Smith', challengeTitle: 'Attend a Webinar', submissionDate: '2023-06-02', status: 'Approved' },
  { id: 3, advocateName: 'Bob Johnson', challengeTitle: 'Share on Social Media', submissionDate: '2023-06-03', status: 'Rejected' },
  // Add more mock submissions as needed
]

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<keyof Submission>('submissionDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }

  const handleSort = (field: keyof Submission) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedSubmissions = [...submissions]
    .filter(submission =>
      Object.values(submission).some(value =>
        String(value).toLowerCase().includes(filter)
      )
    )
    .sort((a, b) => {
      const aValue = String(a[sortBy])
      const bValue = String(b[sortBy])
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  const handleReview = (submission: Submission) => {
    setSelectedSubmission(submission)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submissions</h1>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Filter submissions..."
            value={filter}
            onChange={handleFilter}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('advocateName')} className="cursor-pointer">
                Advocate Name {sortBy === 'advocateName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('challengeTitle')} className="cursor-pointer">
                Challenge {sortBy === 'challengeTitle' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('submissionDate')} className="cursor-pointer">
                Submitted {sortBy === 'submissionDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.advocateName}</TableCell>
                <TableCell>{submission.challengeTitle}</TableCell>
                <TableCell>{submission.submissionDate}</TableCell>
                <TableCell>{submission.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleReview(submission)}>Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={selectedSubmission !== null} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Advocate</h3>
                <p>{selectedSubmission.advocateName}</p>
              </div>
              <div>
                <h3 className="font-medium">Challenge</h3>
                <p>{selectedSubmission.challengeTitle}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p>{selectedSubmission.status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
