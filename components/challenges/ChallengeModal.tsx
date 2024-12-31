import { Dialog } from '@/components/ui/dialog';
import { Challenge } from '@/types/index';
import { Button } from '@/components/ui/button';

interface ChallengeModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function ChallengeModal({
  challenge,
  isOpen,
  onClose,
  onAccept,
}: ChallengeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{challenge.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {challenge.imageUrl && (
            <div className="mt-4">
              <img
                src={challenge.imageUrl}
                alt={challenge.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {challenge.type.replace(/_/g, ' ')}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {challenge.points} points
              </span>
              {challenge.deadline && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Due: {new Date(challenge.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <p className="mt-4 text-gray-600">{challenge.description}</p>

            <div className="mt-6">
              <h3 className="text-lg font-medium">Instructions</h3>
              <ol className="mt-2 list-decimal list-inside space-y-2">
                {challenge.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-600">{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium">Required Proof</h3>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {challenge.proofRequirements.map((proof) => (
                  <li key={proof} className="text-gray-600">
                    {proof.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={onAccept}>
              Accept Challenge
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
