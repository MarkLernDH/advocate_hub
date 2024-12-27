'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data for submissions
const mockSubmissions = [
  { id: 1, advocateName: 'John Doe', challengeTitle: 'Write a Product Review', submissionDate: '2023-06-01', status: 'Pending' },
  { id: 2, advocateName: 'Jane Smith', challengeTitle: 'Attend a Webinar', submissionDate: '2023-06-02', status: 'Approved' },
  { id: 3, advocateName: 'Bob Johnson', challengeTitle: 'Share on Social Media', submissionDate: '2023-06-03', status: 'Rejected' },
  // Add more mock submissions as needed
]

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('submissionDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const handleFilter = (e) => {
    setFilter(e.target.value.toLowerCase())
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedSubmissions = submissions
    .filter(submission => 
      submission.advocateName.toLowerCase().includes(filter) ||
      submission.challengeTitle.toLowerCase().includes(filter) ||
      submission.status.toLowerCase().includes(filter)
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleReview = (submission) => {
    setSelectedSubmission(submission)
  }

  const handleApprove = () => {
    setSubmissions(submissions.map(sub => 
      sub.id === selectedSubmission.id ? {...sub, status: 'Approved'} : sub
    ))
    setSelectedSubmission(null)
  }

  const handleReject = () => {
    setSubmissions(submissions.map(sub => 
      sub.id === selectedSubmission.id ? {...sub, status: 'Rejected'} : sub
    ))
    setSelectedSubmission(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submission Queue</h1>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Filter submissions..."
          onChange={handleFilter}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submissionDate">Submission Date</SelectItem>
            <SelectItem value="advocateName">Advocate Name</SelectItem>
            <SelectItem value="challengeTitle">Challenge Title</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('advocateName')}>Advocate Name</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('challengeTitle')}>Challenge Title</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('submissionDate')}>Submission Date</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.advocateName}</TableCell>
              <TableCell>{submission.challengeTitle}</TableCell>
              <TableCell>{submission.submissionDate}</TableCell>
              <TableCell>{submission.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleReview(submission)}>Review</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Review Submission</DialogTitle>
                      <DialogDescription>
                        Review and approve or reject the submission.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedSubmission && (
                      <div className="mt-4">
                        <p><strong>Advocate:</strong> {selectedSubmission.advocateName}</p>
                        <p><strong>Challenge:</strong> {selectedSubmission.challengeTitle}</p>
                        <p><strong>Submission Date:</strong> {selectedSubmission.submissionDate}</p>
                        <p><strong>Current Status:</strong> {selectedSubmission.status}</p>
                        {/* Add more submission details here */}
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">Approve</Button>
                          <Button onClick={handleReject} className="bg-red-500 hover:bg-red-600">Reject</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

