import nodemailer from 'nodemailer';

// Configure nodemailer with your email service provider
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export function newChallengeEmail(advocateName: string, challengeTitle: string, challengeDescription: string) {
  return `
    <h1>New Challenge Available</h1>
    <p>Hello ${advocateName},</p>
    <p>A new challenge is now available:</p>
    <h2>${challengeTitle}</h2>
    <p>${challengeDescription}</p>
    <p>Log in to your account to participate!</p>
  `;
}

export function submissionStatusChangeEmail(advocateName: string, challengeTitle: string, newStatus: string) {
  return `
    <h1>Submission Status Update</h1>
    <p>Hello ${advocateName},</p>
    <p>The status of your submission for the challenge "${challengeTitle}" has been updated to: ${newStatus}</p>
    <p>Log in to your account for more details.</p>
  `;
}

export function pointsAwardedEmail(advocateName: string, points: number, challengeTitle: string) {
  return `
    <h1>Points Awarded</h1>
    <p>Hello ${advocateName},</p>
    <p>Congratulations! You have been awarded ${points} points for completing the challenge "${challengeTitle}".</p>
    <p>Keep up the great work!</p>
  `;
}

