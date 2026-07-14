import * as admin from 'firebase-admin';
import { SEED_PROBLEMS } from '../data/seedProblems';

export const seedDatabaseToFirebase = async (forceOverwrite: boolean = false): Promise<{ success: boolean; count: number; message: string }> => {
  if (!admin.apps.length) {
    console.warn('⚠️ Firebase Admin not initialized. Cannot seed to Firebase database.');
    return { success: false, count: 0, message: 'Firebase Admin not initialized.' };
  }

  try {
    const db = admin.firestore();
    const problemsRef = db.collection('problems');

    // Check existing count if not force overwriting
    if (!forceOverwrite) {
      const existingSnap = await problemsRef.get();
      if (existingSnap.size >= SEED_PROBLEMS.length) {
        console.log(`ℹ️ Firebase database already has ${existingSnap.size} problems stored. Skipping initial auto-seed.`);
        return { success: true, count: existingSnap.size, message: `Database already seeded (${existingSnap.size} problems).` };
      }
    }

    console.log(`⏳ Seeding ${SEED_PROBLEMS.length} problems directly into Firebase Firestore database...`);
    let count = 0;

    // Use batching (Firestore batch allows up to 500 operations per batch)
    const batch = db.batch();
    for (const problem of SEED_PROBLEMS) {
      const docId = problem.id || problem.slug;
      if (!docId) continue;
      const docRef = problemsRef.doc(docId);
      batch.set(docRef, {
        ...problem,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      count++;
    }

    await batch.commit();
    console.log(`✅ Successfully seeded/updated ${count} problems in Firebase Firestore database!`);
    return { success: true, count, message: `Successfully seeded ${count} problems into Firebase.` };
  } catch (error: any) {
    console.error('❌ Error seeding problems to Firebase:', error);
    return { success: false, count: 0, message: error?.message || 'Error writing to Firestore' };
  }
};
