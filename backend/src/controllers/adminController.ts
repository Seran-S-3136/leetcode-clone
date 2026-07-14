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
