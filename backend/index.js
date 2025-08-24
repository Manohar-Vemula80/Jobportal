import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/userroute.js';
import companyRoutes from './routes/companyroute.js';
import jobRoutes from './routes/jobroute.js';
import applicationRoutes from './routes/applicationroute.js';
dotenv.config({});
const app = express();



// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
    credentials: true,
}));

const PORT =process.env.PORT || 3000;
// Routes setup
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});
