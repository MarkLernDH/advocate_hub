'use client'

import { useState } from 'react';
import { ChallengeType, ProofType } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

interface ChallengeFormProps {
  onSubmit: (data: any) => void;
}

export default function ChallengeForm({ onSubmit }: ChallengeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as ChallengeType,
    points: 0,
    proofRequirements: [] as ProofType[],
    imageUrl: '',
    instructions: [''],
    deadline: '',
  });

  const proofTypesByChallenge: Record<ChallengeType, ProofType[]> = {
    [ChallengeType.QUESTIONS]: [ProofType.TEXT],
    [ChallengeType.ONLINE_ACTION]: [ProofType.LINK, ProofType.SCREENSHOT],
    [ChallengeType.CORPORATE_APPROVAL]: [ProofType.ADMIN_APPROVAL],
    [ChallengeType.ADVOCATE_WORKFLOW]: [ProofType.ADMIN_APPROVAL],
    [ChallengeType.UPLOAD_IMAGE]: [ProofType.IMAGE],
    [ChallengeType.UPLOAD_VIDEO]: [ProofType.VIDEO],
    [ChallengeType.UPLOAD_FILE]: [ProofType.FILE],
    [ChallengeType.DISCUSSION_REPLY]: [ProofType.LINK, ProofType.TEXT],
    [ChallengeType.QUIZ]: [ProofType.TEXT],
    [ChallengeType.JOIN_GROUP]: [ProofType.LINK],
    [ChallengeType.API_INTEGRATION]: [ProofType.API_VERIFICATION],
    [ChallengeType.SOCIAL_SHARE]: [ProofType.SOCIAL_LINK],
    [ChallengeType.REFERRAL_SOCIAL]: [ProofType.SOCIAL_LINK],
    [ChallengeType.TWITTER_POST]: [ProofType.SOCIAL_LINK],
    [ChallengeType.FOLLOW_TWITTER]: [ProofType.SOCIAL_LINK],
    [ChallengeType.NPS]: [ProofType.SCREENSHOT],
    [ChallengeType.ONLINE_REVIEW]: [ProofType.LINK],
    [ChallengeType.G2_REVIEW]: [ProofType.LINK],
    [ChallengeType.CHECK_IN]: [ProofType.ADMIN_APPROVAL],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      proofRequirements: proofTypesByChallenge[formData.type as ChallengeType],
    });
  };

  const handleTypeChange = (type: ChallengeType) => {
    setFormData(prev => ({
      ...prev,
      type,
      proofRequirements: proofTypesByChallenge[type],
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Challenge Type</label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleTypeChange(value as ChallengeType)}
        >
          {Object.values(ChallengeType).map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Points</label>
        <Input
          type="number"
          value={formData.points}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
        <Input
          type="url"
          value={formData.imageUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="mt-2">
            <Textarea
              value={instruction}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateInstruction(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              required
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={addInstruction}
          className="mt-2"
          variant="outline"
        >
          Add Step
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline (Optional)</label>
        <Input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Required Proof</label>
        <div className="text-sm text-gray-600">
          {formData.type && (
            <ul className="list-disc pl-5">
              {proofTypesByChallenge[formData.type as ChallengeType].map((proofType) => (
                <li key={proofType}>{proofType.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Challenge
      </Button>
    </form>
  );
}
