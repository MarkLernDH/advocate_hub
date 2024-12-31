'use client'

import { useState } from 'react'
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"

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
]

export default function AdminSubmissions() {
  const [submissions] = useState<Submission[]>(mockSubmissions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const filteredSubmissions = submissions.filter(submission =>
    submission.advocateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Submissions</h1>

      <div className="mb-6">
        <Input
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Advocate</TableHead>
              <TableHead>Challenge</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.advocateName}</TableCell>
                <TableCell>{submission.challengeTitle}</TableCell>
                <TableCell>{submission.submissionDate}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="mt-4">
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Advocate</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.advocateName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Challenge</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.challengeTitle}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.submissionDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedSubmission.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : selectedSubmission.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex space-x-3">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
                {selectedSubmission.status === 'Pending' && (
                  <>
                    <Button variant="destructive">Reject</Button>
                    <Button>Approve</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
