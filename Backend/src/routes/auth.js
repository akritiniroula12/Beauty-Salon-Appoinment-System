import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', register);

// Login (signin)
router.post('/login', login);

// Logout (signout)
router.post('/logout', authenticateToken, logout);

// Get current user (/me)
router.get('/me', authenticateToken, getMe);

export default router;




