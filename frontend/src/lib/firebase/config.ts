import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Modular Firebase Client Configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDLnWxYFrJIk8ctWecp2Sc9ItTG0JuFwW4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'leetcode-9cb41.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'leetcode-9cb41',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'leetcode-9cb41.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '611504045290',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:611504045290:web:103bdad6811203e3776b93',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-CSS4GQSN76',
};

// Check if credentials are set to real values
export const isDemoMode = false;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('⚠️ Firebase Client initialization warning:', error);
}

export { app, auth, db, analytics };
