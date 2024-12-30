'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Submission {
  id: number
  advocateName: string
  challengeTitle: string
  submissionDate: string
  status: string
  reviewDate: string
  reviewer: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

interface SubmissionData {
  id: number
  created_at: string
  status: string
  reviewed_at: string | null
  reviewer: { name: string } | null
  users: { name: string } | null
  challenges: { title: string } | null
}

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [sortField, setSortField] = useState<keyof Submission>('submissionDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const handleSort = (field: keyof Submission) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  useEffect(() => {
    async function fetchSubmissions() {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          submissionDate: created_at,
          status,
          reviewDate: reviewed_at,
          reviewer: reviewers(name),
          users(name),
          challenges(title)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching submissions:', error)
        return
      }

      const formattedData = data.map((item: any) => ({
        id: item.id,
        advocateName: item.users?.name || 'Unknown',
        challengeTitle: item.challenges?.title || 'Unknown Challenge',
        submissionDate: new Date(item.submissionDate).toLocaleDateString(),
        status: item.status,
        reviewDate: item.reviewDate ? new Date(item.reviewDate).toLocaleDateString() : '-',
        reviewer: item.reviewer?.name || '-'
      }))
      
      setSubmissions(formattedData)
      setLoading(false)
    }

    fetchSubmissions()
  }, [])

  const sortedSubmissions = [...submissions]
    .filter(submission =>
      submission.advocateName.toLowerCase().includes(searchTerm) ||
      submission.challengeTitle.toLowerCase().includes(searchTerm) ||
      submission.status.toLowerCase().includes(searchTerm) ||
      submission.reviewer.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      return sortOrder === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1
    })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submission History</h1>
      <div className="flex gap-4">
        <Input
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('id')}>ID</TableHead>
              <TableHead onClick={() => handleSort('advocateName')}>Advocate</TableHead>
              <TableHead onClick={() => handleSort('challengeTitle')}>Challenge</TableHead>
              <TableHead onClick={() => handleSort('submissionDate')}>Submitted</TableHead>
              <TableHead onClick={() => handleSort('status')}>Status</TableHead>
              <TableHead onClick={() => handleSort('reviewDate')}>Review Date</TableHead>
              <TableHead onClick={() => handleSort('reviewer')}>Reviewer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.advocateName}</TableCell>
                <TableCell>{submission.challengeTitle}</TableCell>
                <TableCell>{submission.submissionDate}</TableCell>
                <TableCell>{submission.status}</TableCell>
                <TableCell>{submission.reviewDate}</TableCell>
                <TableCell>{submission.reviewer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}