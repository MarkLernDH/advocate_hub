'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Button } from "../ui/button"
import { ChallengeForm } from "./ChallengeForm"
import { Challenge } from '@/lib/types' 
import { z } from 'zod'
import { ChallengeType, ProofType } from '@/lib/types'

const challengeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.nativeEnum(ChallengeType),
  points: z.number().min(1, 'Points must be greater than 0'),
  proofRequirements: z.array(z.nativeEnum(ProofType)),
  instructions: z.array(z.string()),
  imageUrl: z.string().optional(),
  deadline: z.string().optional(),
})

type ChallengeFormData = z.infer<typeof challengeSchema>

interface ChallengeModalProps {
  trigger: React.ReactNode
  title: string
  onSubmit: (data: ChallengeFormData) => void
  initialData?: Partial<ChallengeFormData>
}

export function ChallengeModal({ trigger, title, onSubmit, initialData }: ChallengeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ChallengeForm onSubmit={onSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  )
}
