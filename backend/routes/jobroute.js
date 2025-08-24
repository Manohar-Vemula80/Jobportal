import express from 'express';
import { isAuthenticated } from '../middelware/isAuthenticated.js';
import { postJob, getJobs, getJobById,getAdminJobs } from '../controllers/jobcontroller.js';
import { singleUpload } from '../middelware/multer.js';

const router = express.Router();
router.post('/post', isAuthenticated,singleUpload, postJob);
router.get('/get', isAuthenticated, getJobs);
router.get('/get/:id', isAuthenticated, getJobById);
router.get('/getadminjobs', isAuthenticated, getAdminJobs);

export default router;