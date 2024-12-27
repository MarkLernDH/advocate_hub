'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for submission history
const mockHistory = [
  { id: 1, advocateName: 'John Doe', challengeTitle: 'Write a Product Review', submissionDate: '2023-05-01', reviewDate: '2023-05-03', status: 'Approved', reviewer: 'Admin1' },
  { id: 2, advocateName: 'Jane Smith', challengeTitle: 'Attend a Webinar', submissionDate: '2023-05-02', reviewDate: '2023-05-04', status: 'Rejected', reviewer: 'Admin2' },
  { id: 3, advocateName: 'Bob Johnson', challengeTitle: 'Share on Social Media', submissionDate: '2023-05-03', reviewDate: '2023-05-05', status: 'Approved', reviewer: 'Admin1' },
  // Add more mock history entries as needed
]

export default function SubmissionHistory() {
  const [history, setHistory] = useState(mockHistory)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('submissionDate')
  const [sortOrder, setSortOrder] = useState('desc')

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

  const filteredAndSortedHistory = history
    .filter(entry => 
      entry.advocateName.toLowerCase().includes(filter) ||
      entry.challengeTitle.toLowerCase().includes(filter) ||
      entry.status.toLowerCase().includes(filter) ||
      entry.reviewer.toLowerCase().includes(filter)
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submission History</h1>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Filter history..."
          onChange={handleFilter}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submissionDate">Submission Date</SelectItem>
            <SelectItem value="reviewDate">Review Date</SelectItem>
            <SelectItem value="advocateName">Advocate Name</SelectItem>
            <SelectItem value="challengeTitle">Challenge Title</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="reviewer">Reviewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('advocateName')}>Advocate Name</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('challengeTitle')}>Challenge Title</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('submissionDate')}>Submission Date</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('reviewDate')}>Review Date</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('reviewer')}>Reviewer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedHistory.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.advocateName}</TableCell>
              <TableCell>{entry.challengeTitle}</TableCell>
              <TableCell>{entry.submissionDate}</TableCell>
              <TableCell>{entry.reviewDate}</TableCell>
              <TableCell>{entry.status}</TableCell>
              <TableCell>{entry.reviewer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

