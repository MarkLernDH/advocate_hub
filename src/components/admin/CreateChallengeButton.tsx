'use client'

import { useState } from 'react'
import { CreateChallengeDialog } from './CreateChallengeDialog'

export function CreateChallengeButton() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Create Challenge
      </button>
      <CreateChallengeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
