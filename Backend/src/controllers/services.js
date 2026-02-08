import { prisma } from '../lib/prisma.js';

export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get service by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, duration, image } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Name, price, and duration are required' });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        duration: parseInt(duration),
        image: image || null,
      },
    });

    res.status(201).json({ service });
  } catch (error) {
    console.error('Create service error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return res.status(400).json({ message: 'Invalid service ID' });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete the service
    await prisma.service.delete({
      where: { id: serviceId },
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};