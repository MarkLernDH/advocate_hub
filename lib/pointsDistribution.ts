import { Advocate, Challenge, SubmissionStatus } from '../types';
import { sendEmail, pointsAwardedEmail } from './emailService';

export async function awardPoints(advocate: Advocate, challenge: Challenge, status: SubmissionStatus): Promise<number> {
  if (status === SubmissionStatus.APPROVED) {
    const pointsAwarded = challenge.points;
    advocate.points += pointsAwarded;

    // Update advocate points in the database
    // This is a placeholder and should be replaced with actual database update logic
    await updateAdvocatePoints(advocate.id, advocate.points);

    // Send email notification
    const emailContent = pointsAwardedEmail(advocate.name, pointsAwarded, challenge.title);
    await sendEmail(advocate.email, 'Points Awarded', emailContent);

    return pointsAwarded;
  }

  return 0;
}

async function updateAdvocatePoints(advocateId: string, newPoints: number): Promise<void> {
  // This is a placeholder function and should be replaced with actual database update logic
  console.log(`Updating points for advocate ${advocateId} to ${newPoints}`);
  // Implement your database update logic here
}

