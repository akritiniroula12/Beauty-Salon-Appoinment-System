import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

// --- ADDED updateUser function ---
export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, password, phone } = req.body;

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Security check: ensure user is updating their own profile or is admin
    if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ message: 'User updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'P2025') { // Prisma record not found error code
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error during update' });
  }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, roleDescription, bio, skills } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction to create User and Staff linked
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create User
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'STAFF'
        }
      });

      // 2. Create Staff linked to User
      const staff = await prisma.staff.create({
        data: {
          userId: user.id,
          name,
          email,
          role: roleDescription || 'Stylist',
          bio,
          skills
        }
      });

      return { user, staff };
    });

    res.status(201).json({
      message: 'Staff account created successfully',
      staff: result.staff,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      }
    });

  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ message: 'Server error creating staff account' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // If staff, maybe return staff details? For now just role is enough for frontend redirect
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// --- NEW CODE ADDED BELOW FOR ADMIN DASHBOARD ---

export const getAllUsers = async (req, res) => {
  try {
    // Fetch only CUSTOMER role users (exclude ADMIN accounts)
    // Using _count to get appointment count with LEFT JOIN behavior (users with 0 appointments still included)
    const users = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    // Map the results to include appointmentCount as a direct field
    const usersWithCount = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      appointmentCount: user._count.appointments
    }));

    res.json({ users: usersWithCount });
  } catch (error) {
    console.error('Fetch all users error:', error);
    res.status(500).json({ message: 'Server error fetching all users' });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    // Fetch only ADMIN role users
    // Using _count to get appointment count with LEFT JOIN behavior (users with 0 appointments still included)
    const staff = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    // Map the results to include appointmentCount as a direct field
    const staffWithCount = staff.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      appointmentCount: user._count.appointments
    }));

    res.json({ users: staffWithCount });
  } catch (error) {
    console.error('Fetch all staff error:', error);
    res.status(500).json({ message: 'Server error fetching all staff' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log('Delete user endpoint hit, params:', req.params);
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        appointments: true,
        reviews: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's reviews first (foreign key constraint)
    if (user.reviews.length > 0) {
      await prisma.review.deleteMany({
        where: { userId: userId }
      });
    }

    // Delete user's appointments (including active and cancelled ones)
    // This allows deletion even if user has active appointments
    if (user.appointments.length > 0) {
      await prisma.appointment.deleteMany({
        where: { userId: userId }
      });
    }

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);

    // Handle foreign key constraint errors
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return res.status(400).json({
        message: 'Cannot delete user. User has associated records (appointments or reviews) that prevent deletion.'
      });
    }

    res.status(500).json({ message: 'Server error during user deletion' });
  }
};