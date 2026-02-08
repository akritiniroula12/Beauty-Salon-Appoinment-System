import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import authRoutes from './src/routes/auth.js';
import appointmentRoutes from './src/routes/appointments.js';
import serviceRoutes from './src/routes/services.js';
import staffRoutes from './src/routes/staff.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
