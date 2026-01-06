import express from 'express';
import { getServices, getServiceById } from '../controllers/services.js';

const router = express.Router();

// Get all services
router.get('/', getServices);

// Get service by id
router.get('/:id', getServiceById);

export default router;