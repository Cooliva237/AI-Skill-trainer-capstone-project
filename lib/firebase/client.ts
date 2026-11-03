import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const dataMode = process.env.NEXT_PUBLIC_DATA_MODE === 'firebase' ? 'firebase' : 'local';
export function firebaseClient() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  if (Object.values(config).some(value => !value || value.startsWith('REPLACE_'))) {
    throw new Error('Firebase setup is incomplete. Fill in .env.local using .env.example, then restart the app.');
  }
  const app = getApps().length ? getApp() : initializeApp(config);
  return { auth: getAuth(app), db: getFirestore(app) };
}
export function cloudError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/email-already-in-use': 'This email already has a Firebase account. Log in instead.',
    'auth/weak-password': 'Use a stronger password that meets the project password policy.',
    'auth/operation-not-allowed': 'Enable Email/Password sign-in in Firebase Authentication.',
    'auth/unauthorized-domain': 'Add this website domain in Firebase Authentication → Settings → Authorized domains.',
    'auth/network-request-failed': 'Cannot reach Firebase. Check your internet connection and retry.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'permission-denied': 'Cloud access was denied. Publish the included firestore.rules in your Firebase project.',
    'unavailable': 'Cloud data is unavailable. Check your connection and retry.',
  };
  return messages[code ?? ''] ?? (error instanceof Error ? error.message : 'The request failed. Please retry.');
}
