import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/auth/all');
    return response.data;
  },

  getAllStaff: async () => {
    const response = await apiClient.get('/auth/staff');
    return response.data;
  },

  // --- DELETE FUNCTION ADDED HERE ---
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/auth/users/${id}`);
    return response.data;
  },

  // OPTIONAL: Update user role or info
  updateUser: async (id, data) => {
    const response = await apiClient.put(`/auth/users/${id}`, data);
    return response.data;
  },

  createStaff: async (data) => {
    const response = await apiClient.post('/auth/staff/create', data);
    return response.data;
  }
};

// Staff API calls
export const staffAPI = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/staff/dashboard');
    return response.data;
  },
  getAppointments: async () => {
    const response = await apiClient.get('/staff/appointments');
    return response.data;
  },
  updateAppointmentStatus: async (id, status) => {
    const response = await apiClient.put(`/staff/appointments/${id}/status`, { status });
    return response.data;
  },
  getAvailability: async () => {
    const response = await apiClient.get('/staff/availability');
    return response.data;
  },
  updateAvailability: async (availability) => {
    const response = await apiClient.post('/staff/availability', { availability });
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await apiClient.put('/staff/profile', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get('/staff/profile');
    return response.data;
  }
};

// Appointments API calls
export const appointmentsAPI = {
  createAppointment: async (data) => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  getUserAppointments: async () => {
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  getAdminAppointments: async () => {
    const response = await apiClient.get('/appointments/admin');
    return response.data;
  },

  // You might also want a way to delete/cancel appointments here
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  }
};

// Services API calls
export const servicesAPI = {
  getServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  getServiceById: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  createService: async (data) => {
    const response = await apiClient.post('/services', data);
    return response.data;
  },

  deleteService: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};

export default apiClient;