import express from 'express';
import { createAppointment, getUserAppointments } from '../controllers/appointments.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All appointment routes require authentication
router.use(authenticateToken);

// Create appointment
router.post('/', createAppointment);

// Get user's appointments
router.get('/', getUserAppointments);

export default router;