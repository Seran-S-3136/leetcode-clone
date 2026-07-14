import { Router } from 'express';
import {
  runCodeHandler,
  submitCodeHandler,
  checkSubmissionStatusHandler,
  fetchExecutionResultHandler,
  getProblemsHandler,
  getProblemBySlugHandler,
} from '../controllers/executionController';
import {
  importProblemFromUrlHandler,
  createManualProblemHandler,
  updateProblemHandler,
  deleteProblemHandler,
  seedFirebaseHandler,
} from '../controllers/adminController';

const router = Router();

// Execution endpoints
router.post('/execute/run', runCodeHandler);
router.post('/execute/submit', submitCodeHandler);
router.get('/execute/status/:token', checkSubmissionStatusHandler);
router.get('/execute/result/:token', fetchExecutionResultHandler);
router.get('/submissions/status/:token', checkSubmissionStatusHandler);
router.get('/submissions/result/:token', fetchExecutionResultHandler);

// Problems endpoints
router.get('/problems', getProblemsHandler);
router.get('/problems/:slug', getProblemBySlugHandler);

// Admin endpoints
router.post('/admin/import-url', importProblemFromUrlHandler);
router.post('/admin/problems', createManualProblemHandler);
router.put('/admin/problems/:id', updateProblemHandler);
router.delete('/admin/problems/:id', deleteProblemHandler);
router.post('/admin/seed-firebase', seedFirebaseHandler);
router.get('/admin/seed-firebase', seedFirebaseHandler);

export default router;
