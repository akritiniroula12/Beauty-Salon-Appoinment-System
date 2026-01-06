import { prisma } from '../lib/prisma.js';

export const createAppointment = async (req, res) => {
  try {
    const { serviceId, staffId, appointmentDate, notes } = req.body;
    const userId = req.user.id; // Assuming auth middleware sets req.user

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
    const userId = req.user.id;

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