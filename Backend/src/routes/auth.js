import express from 'express';
// 1. Added getAllUsers and updateUser to the import list below
import { register, login, logout, getMe, getAllUsers, getAllStaff, deleteUser, updateUser, createStaff } from '../controllers/auth.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', register);

// Login (signin)
router.post('/login', login);

// Logout (signout)
router.post('/logout', authenticateToken, logout);

// Get current user (/me)
router.get('/me', authenticateToken, getMe);

// 2. ADD THIS NEW LINE HERE FOR THE ADMIN DASHBOARD
// This creates the 'door' for your dashboard to see all users
router.get('/all', authenticateToken, getAllUsers);

// Get all staff (ADMIN role users)
router.get('/staff', authenticateToken, getAllStaff);

// Create new staff member (Admin only)
router.post('/staff/create', authenticateToken, authorizeRoles('ADMIN'), createStaff);

// Delete user by ID - placed after /all to avoid route conflicts
router.delete('/users/:id', authenticateToken, deleteUser);

// Update user by ID
router.put('/users/:id', authenticateToken, updateUser);

export default router;