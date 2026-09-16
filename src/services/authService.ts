import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export const authService = {
  /**
   * Listen to auth state changes directly from Firebase Auth
   */
  subscribeToAuthChanges(callback: (user: AdminUser | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Admin'
        });
      } else {
        callback(null);
      }
    });
  },

  /**
   * Log into admin dashboard strictly using Firebase Authentication
   */
  async login(email: string, password: string): Promise<AdminUser> {
    if (!auth) {
      throw new Error('Firebase Authentication is not initialized.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || 'Admin'
      };
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      throw new Error(err.message || 'Firebase authentication failed');
    }
  },

  /**
   * Log out from admin dashboard
   */
  async logout(): Promise<void> {
    if (auth) {
      await firebaseSignOut(auth);
    }
  }
};
