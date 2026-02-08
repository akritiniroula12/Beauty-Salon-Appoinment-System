import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import { appointmentsAPI } from '../services/api';

const UserBookings = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsRes = await appointmentsAPI.getUserAppointments();
        
        // Filter appointments for current user
        const userAppointments = appointmentsRes.appointments.filter(apt => 
          apt.userId === user.id
        );
        
        setAppointments(userAppointments);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load your appointments. Please ensure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <UserSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-pink-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading your appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <UserSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        
        {/* Header */}
        <header className="bg-white shadow-md rounded-xl mb-6 flex-shrink-0">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-600 mt-2">View and manage your appointment history</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {appointments.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Service</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr key={appointment.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                              <FaCalendarAlt className="text-pink-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{appointment.serviceName || 'Service'}</p>
                              {appointment.notes && (
                                <p className="text-sm text-gray-500">{appointment.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <FaClock className="text-gray-400" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatTime(appointment.date)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={getStatusBadge(appointment.status)}>
                            {appointment.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit appointment"
                            >
                              <FaEdit />
                            </button>
                            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel appointment"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-6">You haven't booked any appointments. Start by booking your first beauty treatment!</p>
              <button
                onClick={() => window.location.href = '/booking'}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Book First Appointment
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserBookings;
