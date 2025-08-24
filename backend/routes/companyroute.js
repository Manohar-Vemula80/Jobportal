import express from 'express';
import { getCompany, getCompanyById, updateCompany, registerCompany } from '../controllers/companycontroller.js';
import { isAuthenticated } from '../middelware/isAuthenticated.js';
import { singleUpload } from '../middelware/multer.js';

const router = express.Router();

router.post('/register', isAuthenticated, registerCompany);
router.get('/get', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated, singleUpload, updateCompany);

export default router;
