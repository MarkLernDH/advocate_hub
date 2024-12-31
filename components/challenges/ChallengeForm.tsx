'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select } from "../ui/select"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { z } from 'zod'
import { ChallengeType, ProofType } from '@/types/index'

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

interface ChallengeFormProps {
  onSubmit: (data: ChallengeFormData) => void
  initialData?: Partial<ChallengeFormData>
}

export function ChallengeForm({ onSubmit, initialData }: ChallengeFormProps) {
  const [instructions, setInstructions] = useState<string[]>(initialData?.instructions || [''])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: initialData,
  })

  const addInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const removeInstruction = (index: number) => {
    const newInstructions = instructions.filter((_, i) => i !== index)
    setInstructions(newInstructions)
    setValue('instructions', newInstructions)
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
    setValue('instructions', newInstructions)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          {...register('title')}
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          {...register('description')}
          className="mt-1"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Challenge Type
        </label>
        <Select onValueChange={(value) => setValue('type', value as ChallengeType)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a challenge type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ChallengeType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="points" className="block text-sm font-medium text-gray-700">
          Points
        </label>
        <Input
          id="points"
          type="number"
          {...register('points', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.points && (
          <p className="mt-1 text-sm text-red-600">{errors.points.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => removeInstruction(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addInstruction}
          className="mt-2"
        >
          Add Step
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URL (Optional)
        </label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          className="mt-1"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deadline (Optional)
        </label>
        <Input
          id="deadline"
          type="datetime-local"
          {...register('deadline')}
          className="mt-1"
        />
        {errors.deadline && (
          <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
        )}
      </div>

      <Button type="submit">
        {initialData ? 'Update Challenge' : 'Create Challenge'}
      </Button>
    </form>
  )
}
