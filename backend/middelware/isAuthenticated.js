import jwt from 'jsonwebtoken';
import { User } from '../models/usermodel.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access', success: false });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded JWT:", decoded);

        // Match the key you used in jwt.sign
        const userId = decoded.id || decoded.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token payload', success: false });
        }

        // Fetch full user (optional but ensures exists)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found', success: false });
        }

        req.user = user;
        req.id = String(user._id); // Now req.user._id will be valid
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Unauthorized access', success: false });
    }
};
