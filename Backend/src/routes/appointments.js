import express from 'express';
// We must include getAdminAppointments in this list
import { 
  createAppointment, 
  getUserAppointments, 
  getAdminAppointments 
} from '../controllers/appointments.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All appointment routes require authentication
router.use(authenticateToken);

// 1. Route for Users to book (Current path: /api/appointments)
router.post('/', createAppointment);

// 2. Route for Users to see THEIR own bookings (Current path: /api/appointments)
router.get('/', getUserAppointments);

// 3. NEW Route for Admin to see ALL 10 bookings (Current path: /api/appointments/admin)
// This is the one that will show 10, 11, 12, etc.
router.get('/admin', getAdminAppointments);

export default router;