import { prisma } from '../lib/prisma.js';

// Get Staff Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find staff record for this user
        const staff = await prisma.staff.findUnique({
            where: { userId: userId }
        });

        if (!staff) {
            return res.status(404).json({ message: 'Staff profile not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's appointments for this staff
        const todaysAppointments = await prisma.appointment.count({
            where: {
                staffId: staff.id,
                appointmentDate: {
                    gte: today,
                    lt: tomorrow
                },
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        // Get total upcoming appointments
        const upcomingAppointments = await prisma.appointment.count({
            where: {
                staffId: staff.id,
                appointmentDate: {
                    gte: today
                },
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        // Get pending appointments
        const pendingAppointments = await prisma.appointment.count({
            where: {
                staffId: staff.id,
                status: 'PENDING'
            }
        });

        res.json({
            stats: {
                today: todaysAppointments,
                upcoming: upcomingAppointments,
                pending: pendingAppointments
            }
        });

    } catch (error) {
        console.error('Values stats error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

// Get Staff Appointments
export const getAppointments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const staff = await prisma.staff.findUnique({ where: { userId } });

        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        const appointments = await prisma.appointment.findMany({
            where: {
                staffId: staff.id
            },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                service: true
            },
            orderBy: {
                appointmentDate: 'asc'
            }
        });

        res.json({ appointments });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
};

// Update Appointment Status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.userId;

        const staff = await prisma.staff.findUnique({ where: { userId } });
        if (!staff) return res.status(403).json({ message: 'Not authorized' });

        // Verify appointment belongs to staff
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: parseInt(id),
                staffId: staff.id
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or not assigned to you' });
        }

        const allowed = ['PENDING','CONFIRMED','CANCELLED','COMPLETED'];
        if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

        const updated = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ message: 'Status updated', appointment: updated });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

// Get Availability
export const getAvailability = async (req, res) => {
    try {
        const userId = req.user.userId;
        const staff = await prisma.staff.findUnique({ where: { userId } });

        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        res.json({ availability: staff.availability || {} });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability' });
    }
};

// Update Availability
export const updateAvailability = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { availability } = req.body; // Expect JSON object

        const staff = await prisma.staff.update({
            where: { userId },
            data: { availability }
        });

        res.json({ message: 'Availability updated', availability: staff.availability });
    } catch (error) {
        res.status(500).json({ message: 'Error updating availability' });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const staff = await prisma.staff.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!staff) return res.status(404).json({ message: 'Staff profile not found' });

        res.json({ staff });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bio, skills, name, specialization } = req.body;

        // Use transaction to update both Staff and User (name stored on user)
        const result = await prisma.$transaction(async (tx) => {
            const staff = await tx.staff.update({
                where: { userId },
                data: { bio, skills, name, specialization }
            });

            if (name) {
                await tx.user.update({ where: { id: userId }, data: { name } });
            }

            return staff;
        });

        res.json({ message: 'Profile updated', staff: result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};
