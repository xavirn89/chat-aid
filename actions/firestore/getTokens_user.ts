// ./actions/firestore/getTokens_user.ts
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getTokens_user(userId: string) {
  try {
    const docRef = doc(db, 'tokens', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'No such document' };
    }
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return { success: false, error };
  }
}
