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
    title: 'Social Media Spotlight',
    description: 'Share your favorite feature on LinkedIn or Twitter',
    bonusPoints: 300,
    timeRemaining: '15:05'
  }
];

export function DailyBonus() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Daily Bonus Challenges</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {DAILY_CHALLENGES.map((challenge) => (
          <Card key={challenge.id} className="p-6 hover:shadow-lg hover:scale-102 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm">{challenge.description}</p>
              </div>
              <Badge variant="secondary" className="animate-pulse">
                <Star className="w-4 h-4 mr-1" />
                {challenge.bonusPoints} pts
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{challenge.timeRemaining} remaining</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}