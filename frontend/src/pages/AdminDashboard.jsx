import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaCog, FaSignOutAlt, FaChartBar, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, servicesAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalUsers: 0,
    totalServices: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      // User data not loaded yet, wait
      return;
    }
    if (role !== 'ADMIN') {
      // Not an admin, redirect to home or user dashboard
      navigate('/user/dashboard');
    }
  }, [role, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch services to get stats
        const servicesResponse = await servicesAPI.getServices();
        setStats(prev => ({
          ...prev,
          totalServices: servicesResponse.services.length,
        }));
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Total Users</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
              </div>
              <FaUsers className="text-5xl text-pink-400 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Total Appointments</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalAppointments}</p>
              </div>
              <FaCalendarCheck className="text-5xl text-blue-400 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Total Services</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalServices}</p>
              </div>
              <FaCog className="text-5xl text-purple-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FaUsers className="text-2xl text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage customer accounts and permissions</p>
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Manage Users
            </button>
          </div>

          {/* Appointments Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FaCalendarCheck className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
            </div>
            <p className="text-gray-600 mb-4">View and manage all appointments</p>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Appointments
            </button>
          </div>

          {/* Services Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FaCog className="text-2xl text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Services</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage salon services and pricing</p>
            <button
              onClick={() => navigate('/admin/services')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Manage Services
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FaChartBar className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
            </div>
            <p className="text-gray-600 mb-4">View analytics and business reports</p>
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/appointments')}
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <FaCalendarCheck className="text-2xl text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">Appointments</p>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <FaUsers className="text-2xl text-pink-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">Users</p>
            </button>
            <button
              onClick={() => navigate('/admin/services')}
              className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <FaCog className="text-2xl text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">Services</p>
            </button>
            <button
              onClick={handleLogout}
              className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <FaSignOutAlt className="text-2xl text-red-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800">Logout</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
