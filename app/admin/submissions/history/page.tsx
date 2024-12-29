'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Submission {
  id: number
  advocateName: string
  challengeTitle: string
  submissionDate: string
  reviewDate: string
  status: string
  reviewer: string
  [key: string]: string | number  // Index signature for dynamic access
}

// Mock data for submission history
const mockHistory: Submission[] = [
  {
    id: 1,
    advocateName: "John Doe",
    challengeTitle: "Share on LinkedIn",
    submissionDate: "2023-12-27",
    reviewDate: "2023-12-28",
    status: "Approved",
    reviewer: "Admin"
  },
  // ... other mock data
]

export default function SubmissionHistory() {
  const [sortField, setSortField] = useState<keyof Submission>('submissionDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (field: keyof Submission) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Sort and filter submissions
  const sortedSubmissions = [...mockHistory]
    .filter(submission =>
      Object.values(submission).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1
      }
      return aValue > bValue ? -1 : 1
    })
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Submission History</h1>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('advocateName')} className="cursor-pointer">
                Advocate Name {sortField === 'advocateName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('challengeTitle')} className="cursor-pointer">
                Challenge {sortField === 'challengeTitle' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('submissionDate')} className="cursor-pointer">
                Submitted {sortField === 'submissionDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('reviewDate')} className="cursor-pointer">
                Reviewed {sortField === 'reviewDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('reviewer')} className="cursor-pointer">
                Reviewer {sortField === 'reviewer' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.map((entry: Submission) => (
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