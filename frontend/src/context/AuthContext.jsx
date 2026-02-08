import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' or 'user'
  const [loading, setLoading] = useState(true);

  // On first load, restore any saved user and role from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token');

    if (storedToken && storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  // Real login with backend API
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Ensure role is stored. Fallback to 'CUSTOMER' if undefined, though backend should send it.
        const userRole = response.user.role || 'CUSTOMER';
        localStorage.setItem('role', userRole);

        setUser(response.user);
        setRole(userRole);

        return { success: true, user: response.user };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login API error:', error);
      // Better error handling
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || 'Login failed';
        return { success: false, message };
      } else if (error.request) {
        // Request was made but no response received
        return { success: false, message: 'Cannot connect to server. Please make sure the backend is running on port 5000.' };
      } else {
        // Something else happened
        return { success: false, message: error.message || 'Login failed' };
      }
    }
  };

  // Real register with backend API
  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });

      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Default to CUSTOMER for new registrations
        const userRole = response.user.role || 'CUSTOMER';
        localStorage.setItem('role', userRole);

        setUser(response.user);
        setRole(userRole);

        return { success: true, user: response.user };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    // Clear user state immediately
    setUser(null);
    setRole(null);

    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    // Force navigation to homepage with full page reload
    window.location.href = '/';
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    role,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!role,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
