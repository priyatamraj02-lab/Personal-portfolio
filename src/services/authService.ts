import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isDemo?: boolean;
}

const DEMO_ADMIN_SESSION_KEY = 'priyatam_portfolio_admin_demo_session';

export const authService = {
  /**
   * Listen to auth state changes across Firebase Auth and local session fallback
   */
  subscribeToAuthChanges(callback: (user: AdminUser | null) => void): () => void {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Admin',
            isDemo: false
          });
        } else {
          // Check if local demo session is active
          const demoSession = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
          if (demoSession) {
            try {
              const parsed = JSON.parse(demoSession);
              callback(parsed);
              return;
            } catch {
              localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
            }
          }
          callback(null);
        }
      });
    }

    // Offline / Local development fallback mode
    const demoSession = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
    if (demoSession) {
      try {
        const parsed = JSON.parse(demoSession);
        callback(parsed);
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }

    // Return unsubscriber
    return () => {};
  },

  /**
   * Log into admin dashboard using Firebase Auth or local fallback credentials
   */
  async login(email: string, password: string): Promise<AdminUser> {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || 'Admin',
          isDemo: false
        };
      } catch (err: any) {
        // If Firebase Auth fails due to invalid credentials, bubble it up clearly
        throw new Error(err.message || 'Firebase login failed');
      }
    }

    // Local / Offline fallback auth validation (Standard development fallback)
    if (email === 'admin@priyatamraj.dev' && password === 'admin123') {
      const demoUser: AdminUser = {
        uid: 'demo-admin-priyatam',
        email: 'admin@priyatamraj.dev',
        displayName: 'Priyatam Raj (Demo Admin)',
        isDemo: true
      };
      localStorage.setItem(DEMO_ADMIN_SESSION_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    // Allow user-customized email as fallback if matches
    if (password.length >= 6 && email.includes('@')) {
      const customDemoUser: AdminUser = {
        uid: `demo-${Date.now()}`,
        email: email,
        displayName: 'Priyatam Raj (Local Mode)',
        isDemo: true
      };
      localStorage.setItem(DEMO_ADMIN_SESSION_KEY, JSON.stringify(customDemoUser));
      return customDemoUser;
    }

    throw new Error('Invalid email or password. For local demo mode, use admin@priyatamraj.dev / admin123 or enter valid email & 6+ character password.');
  },

  /**
   * Log out from admin dashboard
   */
  async logout(): Promise<void> {
    localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
  }
};
