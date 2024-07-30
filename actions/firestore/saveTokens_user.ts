// ./actions/firestore/saveTokens_user.ts
import { db } from '@/utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function saveTokens_user(userId: string, twitchAccessToken: string, twitchRefreshToken: string) {
  try {
    await setDoc(doc(db, 'tokens', userId), {
      twitchAccessToken,
      twitchRefreshToken,
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving tokens:', error);
    return { success: false, error };
  }
}
