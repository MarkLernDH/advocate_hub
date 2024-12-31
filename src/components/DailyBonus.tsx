'use client';

import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Clock } from 'lucide-react';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  bonusPoints: number;
  timeRemaining: string;
}

interface DailyBonusProps {
  userId: string;
}

const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: '1',
    title: 'Share Your Success Story',
    description: 'Write a detailed success story about how our product helped you',
    bonusPoints: 500,
    timeRemaining: '15:05'
  },
  {
    id: '2',
    title: 'Complete Your Profile',
    description: 'Add your job title and company information',
    bonusPoints: 200,
    timeRemaining: '23:45'
  }
];

export function DailyBonus({ userId }: DailyBonusProps) {
  return (
    <div className="space-y-4">
      {DAILY_CHALLENGES.map((challenge) => (
        <Card key={challenge.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{challenge.title}</h3>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {challenge.bonusPoints}
            </Badge>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{challenge.timeRemaining} remaining</span>
          </div>
        </Card>
      ))}
    </div>
  );
}