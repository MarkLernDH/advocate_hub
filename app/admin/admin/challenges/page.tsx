'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ChallengeForm from '@/components/challenges/ChallengeForm'
import { Dialog } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export default function ChallengesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateChallenge = async (data: any) => {
    // TODO: Implement challenge creation
    console.log('Creating challenge:', data)
    setIsCreateModalOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-gray-500 text-center py-8">No challenges created yet</p>
        </Card>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Create New Challenge</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ChallengeForm onSubmit={handleCreateChallenge} />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
