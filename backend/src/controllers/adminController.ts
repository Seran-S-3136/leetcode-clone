import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { ScraperService } from '../services/scraperService';
import { SEED_PROBLEMS, Problem, DELETED_PROBLEM_IDS } from '../data/seedProblems';
import { seedDatabaseToFirebase } from '../services/seedDatabaseService';

export const seedFirebaseHandler = async (req: Request, res: Response) => {
  try {
    const force = req.query.force === 'true' || req.body.force === true;
    const result = await seedDatabaseToFirebase(force);
    if (!result.success) {
      return res.status(500).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Error seeding Firebase' });
  }
};

export const importProblemFromUrlHandler = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid problem URL.' });
    }

    const importedData = await ScraperService.importProblemFromUrl(url);
    return res.status(200).json({
      success: true,
      message: 'Problem imported successfully!',
      data: importedData,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to import problem.' });
  }
};

export const createManualProblemHandler = async (req: Request, res: Response) => {
  try {
    const newProblem: Problem = req.body;
    if (!newProblem.title || !newProblem.difficulty) {
      return res.status(400).json({ error: 'Title and difficulty are required.' });
    }

    // Assign id/slug if missing
    if (!newProblem.slug) {
      newProblem.slug = newProblem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (!newProblem.id) {
      newProblem.id = newProblem.slug;
    }

    // Remove from deleted list if re-adding
    DELETED_PROBLEM_IDS.delete(newProblem.id);
    DELETED_PROBLEM_IDS.delete(newProblem.slug);

    // Remove old instance if updating in-place
    for (let i = SEED_PROBLEMS.length - 1; i >= 0; i--) {
      if (SEED_PROBLEMS[i].id === newProblem.id || SEED_PROBLEMS[i].slug === newProblem.slug) {
        SEED_PROBLEMS.splice(i, 1);
      }
    }
    // Add to in-memory seed list for immediate interaction
    SEED_PROBLEMS.unshift(newProblem);

    // Persist to Firebase Firestore using Admin SDK (both under id and slug for guaranteed retrieval/deletion)
    if (admin.apps.length) {
      try {
        await admin.firestore().collection('problems').doc(newProblem.id).set(newProblem, { merge: true });
        if (newProblem.slug !== newProblem.id) {
          await admin.firestore().collection('problems').doc(newProblem.slug).set(newProblem, { merge: true });
        }
      } catch (fsErr) {
        console.warn('Failed to save problem via Admin SDK:', fsErr);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Problem created successfully!',
      problem: newProblem,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create problem.' });
  }
};

export const updateProblemHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated: Partial<Problem> = req.body;

    DELETED_PROBLEM_IDS.delete(id);
    if (updated.id) DELETED_PROBLEM_IDS.delete(updated.id);
    if (updated.slug) DELETED_PROBLEM_IDS.delete(updated.slug);

    let foundSlug = id;
    for (let i = 0; i < SEED_PROBLEMS.length; i++) {
      if (SEED_PROBLEMS[i].id === id || SEED_PROBLEMS[i].slug === id) {
        foundSlug = SEED_PROBLEMS[i].slug;
        SEED_PROBLEMS[i] = { ...SEED_PROBLEMS[i], ...updated };
        break;
      }
    }

    if (admin.apps.length) {
      try {
        await admin.firestore().collection('problems').doc(id).set(updated, { merge: true });
        if (foundSlug !== id) {
          await admin.firestore().collection('problems').doc(foundSlug).set(updated, { merge: true });
        }
      } catch (fsErr) {
        console.warn('Failed to update problem via Admin SDK:', fsErr);
      }
    }

    return res.status(200).json({ success: true, message: 'Problem updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update problem.' });
  }
};

export const deleteProblemHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    DELETED_PROBLEM_IDS.add(id);

    let delSlug = id;
    for (let i = SEED_PROBLEMS.length - 1; i >= 0; i--) {
      if (SEED_PROBLEMS[i].id === id || SEED_PROBLEMS[i].slug === id) {
        delSlug = SEED_PROBLEMS[i].slug;
        DELETED_PROBLEM_IDS.add(SEED_PROBLEMS[i].id);
        DELETED_PROBLEM_IDS.add(SEED_PROBLEMS[i].slug);
        SEED_PROBLEMS.splice(i, 1);
      }
    }

    if (admin.apps.length) {
      try {
        await admin.firestore().collection('problems').doc(id).delete();
        if (delSlug !== id) {
          await admin.firestore().collection('problems').doc(delSlug).delete();
        }
      } catch (fsErr) {
        console.warn('Failed to delete problem via Admin SDK:', fsErr);
      }
    }

    return res.status(200).json({ success: true, message: 'Problem deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete problem.' });
  }
};

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const usersMap = new Map<string, any>();

    if (admin.apps.length) {
      try {
        // 1. Fetch from Firebase Authentication
        const listUsersResult = await admin.auth().listUsers(1000);
        listUsersResult.users.forEach((userRecord) => {
          const email = userRecord.email || '';
          const isAdmin = email.trim().toLowerCase() === 'seran7869@gmail.com';
          usersMap.set(userRecord.uid, {
            uid: userRecord.uid,
            email: email || `${userRecord.uid}@codearena.dev`,
            displayName: userRecord.displayName || email.split('@')[0] || 'Platform User',
            role: isAdmin ? 'admin' : 'user',
            solvedCount: { easy: 0, medium: 0, hard: 0 },
            streak: 1,
            acceptanceRate: 100,
            createdAt: userRecord.metadata.creationTime || new Date().toISOString(),
          });
        });
      } catch (authErr) {
        console.warn('Failed to list Auth users via Admin SDK:', authErr);
      }

      try {
        // 2. Fetch from Firestore users collection
        const usersSnap = await admin.firestore().collection('users').get();
        usersSnap.forEach((docSnap) => {
          const data = docSnap.data();
          const uid = data.uid || docSnap.id;
          const email = data.email || '';
          const isAdmin = email.trim().toLowerCase() === 'seran7869@gmail.com' || data.role === 'admin';
          const existing = usersMap.get(uid) || {
            uid,
            email: email || `${uid}@codearena.dev`,
            displayName: data.displayName || email.split('@')[0] || 'Platform User',
            role: isAdmin ? 'admin' : 'user',
            solvedCount: { easy: 0, medium: 0, hard: 0 },
            streak: 1,
            acceptanceRate: 100,
            createdAt: data.createdAt || new Date().toISOString(),
          };
          usersMap.set(uid, {
            ...existing,
            ...data,
            uid,
            role: isAdmin ? 'admin' : (data.role || existing.role),
            solvedCount: data.solvedCount || existing.solvedCount,
            streak: data.streak || existing.streak || 1,
            acceptanceRate: data.acceptanceRate || existing.acceptanceRate || 100,
          });
        });
      } catch (fsErr) {
        console.warn('Failed to get Firestore users collection:', fsErr);
      }

      try {
        // 3. Fetch from Firestore submissions to aggregate real solved counts across all users
        const submissionsSnap = await admin.firestore().collection('submissions').get();
        const userAcceptedSet = new Map<string, Set<string>>();
        submissionsSnap.forEach((docSnap) => {
          const sub = docSnap.data();
          if (sub.status === 'Accepted' && sub.userId && sub.problemId) {
            if (!userAcceptedSet.has(sub.userId)) {
              userAcceptedSet.set(sub.userId, new Set());
            }
            userAcceptedSet.get(sub.userId)!.add(sub.problemId);
          }
        });

        userAcceptedSet.forEach((acceptedIds, uid) => {
          if (usersMap.has(uid)) {
            const u = usersMap.get(uid);
            const totalInProfile = (u.solvedCount?.easy || 0) + (u.solvedCount?.medium || 0) + (u.solvedCount?.hard || 0);
            if (totalInProfile < acceptedIds.size) {
              u.solvedCount = {
                easy: acceptedIds.size,
                medium: 0,
                hard: 0,
              };
            }
          } else {
            usersMap.set(uid, {
              uid,
              email: `${uid}@codearena.dev`,
              displayName: 'Platform User',
              role: 'user',
              solvedCount: { easy: acceptedIds.size, medium: 0, hard: 0 },
              streak: 1,
              acceptanceRate: 100,
              createdAt: new Date().toISOString(),
            });
          }
        });
      } catch (subErr) {
        console.warn('Failed to aggregate submissions:', subErr);
      }
    }

    const usersList = Array.from(usersMap.values());
    return res.status(200).json({ success: true, users: usersList });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Error fetching users' });
  }
};
