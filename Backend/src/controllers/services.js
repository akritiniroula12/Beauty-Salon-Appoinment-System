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