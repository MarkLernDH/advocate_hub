import { DbUser, DbChallenge, SubmissionStatus } from '../types';
import { sendEmail, pointsAwardedEmail } from './emailService';

export async function awardPoints(user: DbUser, challenge: DbChallenge, status: SubmissionStatus): Promise<number> {
  if (status === SubmissionStatus.APPROVED) {
    const pointsAwarded = challenge.points;
    user.points += pointsAwarded;

    // Update advocate points in the database
    // This is a placeholder and should be replaced with actual database update logic
    await updateUserPoints(user.id, user.points);

    // Send email notification
    await sendEmail(
      user.email,
      'Points Awarded!',
      pointsAwardedEmail(user.email, pointsAwarded, challenge.title)
    );

    return pointsAwarded;
  }
  return 0;
}

async function updateUserPoints(userId: string, newPoints: number) {
  console.log(`Updating points for advocate ${userId} to ${newPoints}`);
  // Implement your database update logic here
}
