import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore | null = null;
let auth: admin.auth.Auth | null = null;

import fs from 'fs';
import path from 'path';

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin initialized with serviceAccountKey.json file.');
    } else if (clientEmail && privateKey && projectId) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('✅ Firebase Admin initialized with Service Account .env credentials.');
    } else if (projectId) {
      admin.initializeApp({
        projectId,
      });
      console.log(`ℹ️ Firebase Admin initialized with Project ID (${projectId}) in demo mode.`);
    } else {
      console.warn('⚠️ No Firebase credentials found. Running backend without active Firestore connection.');
    }
  }

  if (admin.apps.length) {
    db = admin.firestore();
    auth = admin.auth();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export { db, auth };
