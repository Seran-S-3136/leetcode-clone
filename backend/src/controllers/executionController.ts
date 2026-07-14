import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { ExecutionService } from '../services/executionService';
import { SEED_PROBLEMS, DELETED_PROBLEM_IDS } from '../data/seedProblems';


// In-memory active execution lock to prevent duplicate submissions while a request is in progress
const activeExecutions = new Set<string>();

// In-memory execution results store for polling Check Submission Status & Fetch Execution Result
const executionResultsCache = new Map<string, any>();

export const runCodeHandler = async (req: Request, res: Response) => {
  try {
    const { problemId, language, code, userId = 'anonymous' } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'Missing required fields: problemId, language, code.' });
    }

    const lockKey = `${userId}:${problemId}:run`;
    if (activeExecutions.has(lockKey)) {
      return res.status(429).json({ error: 'Duplicate request: Code execution is already in progress.' });
    }

    activeExecutions.add(lockKey);
    const token = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    executionResultsCache.set(token, { status: 'Processing', execution_status: 'Processing', token });

    try {
      const result = await ExecutionService.executeCode({
        problemId,
        language,
        code,
        mode: 'run',
      });
      const finalRes = { ...result, token };
      executionResultsCache.set(token, finalRes);
      return res.status(200).json(finalRes);
    } finally {
      activeExecutions.delete(lockKey);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Execution error' });
  }
};

export const submitCodeHandler = async (req: Request, res: Response) => {
  try {
    const { problemId, language, code, userId = 'anonymous' } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'Missing required fields: problemId, language, code.' });
    }

    const lockKey = `${userId}:${problemId}:submit`;
    if (activeExecutions.has(lockKey)) {
      return res.status(429).json({ error: 'Duplicate request: Code submission is already in progress.' });
    }

    activeExecutions.add(lockKey);
    const token = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    executionResultsCache.set(token, { status: 'Processing', execution_status: 'Processing', token });

    try {
      const result = await ExecutionService.executeCode({
        problemId,
        language,
        code,
        mode: 'submit',
      });
      const finalRes = { ...result, token };
      executionResultsCache.set(token, finalRes);
      return res.status(200).json(finalRes);
    } finally {
      activeExecutions.delete(lockKey);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Submission error' });
  }
};

export const checkSubmissionStatusHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: 'Submission token is required.' });
    }
    const cached = executionResultsCache.get(token);
    if (!cached) {
      return res.status(404).json({ error: `Submission status for token "${token}" not found.` });
    }
    return res.status(200).json({
      token,
      status: cached.status || cached.verdict || 'Processing',
      executionStatus: cached.executionStatus || cached.execution_status || cached.status || 'Processing',
      judge0StatusId: cached.judge0StatusId || cached.judge0_status_id || (cached.status === 'Accepted' ? 3 : 2),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Status check error' });
  }
};

export const fetchExecutionResultHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: 'Submission token is required.' });
    }
    const cached = executionResultsCache.get(token);
    if (!cached) {
      return res.status(404).json({ error: `Execution result for token "${token}" not found.` });
    }
    return res.status(200).json(cached);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Result fetch error' });
  }
};

const sortProblemsAscending = (list: any[]): any[] => {
  return [...list].sort((a, b) => {
    const numA = parseInt((String(a?.title || '').match(/^(\d+)\./) || [])[1] || String(a?.title || ''), 10);
    const numB = parseInt((String(b?.title || '').match(/^(\d+)\./) || [])[1] || String(b?.title || ''), 10);
    if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
      return numA - numB;
    }
    return String(a?.title || '').localeCompare(String(b?.title || ''), undefined, { numeric: true, sensitivity: 'base' });
  });
};

export const getProblemsHandler = async (_req: Request, res: Response) => {
  try {
    const dbProblems: any[] = [];
    if (admin.apps.length) {
      try {
        const snap = await admin.firestore().collection('problems').get();
        snap.forEach((doc) => {
          const data = doc.data();
          if (data && data.title && !DELETED_PROBLEM_IDS.has(data.id || '') && !DELETED_PROBLEM_IDS.has(data.slug || '') && !DELETED_PROBLEM_IDS.has(doc.id)) {
            dbProblems.push(data);
          }
        });
      } catch (err) {
        console.warn('Firestore getProblemsHandler fallback:', err);
      }
    }

    const dbMap = new Map(dbProblems.map((p) => [p.id || p.slug, p]));
    const combined = [...dbProblems];

    // Only inject hardcoded seed problems if the database is completely empty (i.e. unseeded/offline)
    if (dbProblems.length === 0) {
      SEED_PROBLEMS.forEach((sp) => {
        if (!DELETED_PROBLEM_IDS.has(sp.id) && !DELETED_PROBLEM_IDS.has(sp.slug)) {
          combined.push(sp);
        }
      });
    }

    return res.status(200).json(sortProblemsAscending(combined));
  } catch (error: any) {
    const activeSeeds = SEED_PROBLEMS.filter((sp) => !DELETED_PROBLEM_IDS.has(sp.id) && !DELETED_PROBLEM_IDS.has(sp.slug));
    return res.status(200).json(sortProblemsAscending(activeSeeds));
  }
};

export const getProblemBySlugHandler = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (DELETED_PROBLEM_IDS.has(slug)) {
    return res.status(404).json({ error: `Problem "${slug}" not found (deleted).` });
  }

  if (admin.apps.length) {
    try {
      const docSnap = await admin.firestore().collection('problems').doc(slug).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (!DELETED_PROBLEM_IDS.has(data?.id || '') && !DELETED_PROBLEM_IDS.has(data?.slug || '')) {
          return res.status(200).json(data);
        }
      } else {
        // If the database has problems and docSnap is not found, the problem was deleted
        const checkSnap = await admin.firestore().collection('problems').limit(1).get();
        if (!checkSnap.empty) {
          return res.status(404).json({ error: `Problem "${slug}" not found in database.` });
        }
      }
    } catch (err) {
      console.warn('Firestore getProblemBySlugHandler fallback:', err);
    }
  }

  const problem = SEED_PROBLEMS.find((p) => (p.slug === slug || p.id === slug) && !DELETED_PROBLEM_IDS.has(p.id) && !DELETED_PROBLEM_IDS.has(p.slug));
  if (!problem) {
    return res.status(404).json({ error: `Problem "${slug}" not found.` });
  }
  return res.status(200).json(problem);
};
