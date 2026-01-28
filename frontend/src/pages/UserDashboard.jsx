import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaSignOutAlt, FaClock, FaUser, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not customer or not logged in
  useEffect(() => {
    if (!user) {
      // User data not loaded yet, wait
      return;
    }
    if (role !== 'CUSTOMER') {
      // Not a customer, redirect to admin dashboard or home
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [role, user, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentsAPI.getUserAppointments();
        setAppointments(response.appointments || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load your appointments');
      } finally {
        setLoading(false);
      }
    };

    if (role === 'CUSTOMER') {
      fetchAppointments();
    }
  }, [role]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
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

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaUser className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">Customer Account</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/booking"
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Book Appointment</h3>
                <p className="text-pink-100">Schedule your next beauty service</p>
              </div>
              <FaArrowRight className="text-4xl opacity-30" />
            </div>
          </Link>

          <Link
            to="/services"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">View Services</h3>
                <p className="text-blue-100">Browse all available services</p>
              </div>
              <FaArrowRight className="text-4xl opacity-30" />
            </div>
          </Link>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-2xl text-white" />
              <h2 className="text-2xl font-bold text-white">My Appointments</h2>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="p-8 text-center">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Yet</h3>
              <p className="text-gray-600 mb-6">You haven't booked any appointments yet.</p>
              <Link
                to="/booking"
                className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Book Your First Appointment
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Service</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{appointment.service?.name}</p>
                          <p className="text-sm text-gray-600">${appointment.service?.price}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FaClock className="text-pink-600" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          appointment.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your appointments or our services, please don't hesitate to contact us.
          </p>
          <a
            href="mailto:info@beautysalon.com"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold"
          >
            Email us: info@beautysalon.com
            <FaArrowRight className="ml-2" />
          </a>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
