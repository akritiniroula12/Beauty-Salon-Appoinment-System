import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import {
    getDashboardStats,
    getAppointments,
    updateAppointmentStatus,
    getAvailability,
    updateAvailability,
    updateProfile, // Fix: updated function name
    getProfile
} from '../controllers/staff.js';

const router = express.Router();

// All routes require authentication and STAFF role
router.use(authenticateToken);
router.use(authorizeRoles('STAFF'));

router.get('/dashboard', getDashboardStats);
router.get('/appointments', getAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.get('/availability', getAvailability);
router.post('/availability', updateAvailability);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);

export default router;
