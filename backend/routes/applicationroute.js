import express from 'express';
import { applyjob,getAppliedJobs,getApplicants,updateStatus,checkApplied } from '../controllers/applicationcontroller.js';
import { isAuthenticated } from '../middelware/isAuthenticated.js';

const router = express.Router();

router.post('/apply/:id', isAuthenticated, applyjob);      // use POST for create
router.get('/check/:id', isAuthenticated, checkApplied); 
router.get('/get', isAuthenticated, getAppliedJobs);
router.get('/:id/applicants', isAuthenticated, getApplicants);
router.post('/status/:id/update', isAuthenticated, updateStatus);

export default router;
