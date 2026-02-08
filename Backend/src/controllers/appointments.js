import { prisma } from '../lib/prisma.js';

export const createAppointment = async (req, res) => {
  try {
    const { serviceId, staffId, appointmentDate, notes } = req.body;
    const userId = req.user.userId; // Assuming auth middleware sets req.user

    // Validate required fields
    if (!serviceId || !appointmentDate) {
      return res.status(400).json({ message: 'Service and appointment date are required' });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if staff exists (if provided)
    if (staffId) {
      const staff = await prisma.staff.findUnique({
        where: { id: parseInt(staffId) }
      });
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        serviceId: parseInt(serviceId),
        staffId: staffId ? parseInt(staffId) : null,
        appointmentDate: new Date(appointmentDate),
        notes,
      },
      include: {
        user: true,
        service: true,
        staff: true,
      },
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      include: {
        service: true,
        staff: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- NEW CODE ADDED BELOW FOR ADMIN DASHBOARD ---

export const getAdminAppointments = async (req, res) => {
  try {
    // This grabs ALL appointments from MySQL for the Admin
    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: { name: true, email: true } // This grabs the customer's name (Akriti, etc.)
        },
        service: {
          select: { name: true, price: true }
        },
        staff: {
          select: { name: true }
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Admin Fetch Appointments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ message: 'Status updated', appointment: updated });
  } catch (error) {
    console.error('Admin Update Status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};