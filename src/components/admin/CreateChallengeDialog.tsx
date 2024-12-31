import { Dialog } from '@/components/ui/Dialog'
import { ChallengeForm } from './ChallengeForm'

interface CreateChallengeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChallengeDialog({
  open,
  onOpenChange
}: CreateChallengeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-lg bg-white p-6">
          <h2 className="text-lg font-semibold">Create New Challenge</h2>
          <ChallengeForm onSuccess={() => onOpenChange(false)} />
        </div>
      </div>
    </Dialog>
  )
}
