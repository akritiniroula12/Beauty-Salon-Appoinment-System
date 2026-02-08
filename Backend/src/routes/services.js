import express from 'express';
import { getServices, getServiceById, createService, deleteService } from '../controllers/services.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all services (public)
router.get('/', getServices);

// Create service (admin only)
router.post('/', authenticateToken, createService);

// Get service by id
router.get('/:id', getServiceById);

// Delete service (admin only)
router.delete('/:id', authenticateToken, deleteService);

export default router;