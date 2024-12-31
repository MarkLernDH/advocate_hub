import { getCurrentUser } from '../auth';

export async function getUser() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
