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
};

export default apiClient;
