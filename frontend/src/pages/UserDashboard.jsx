import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import { appointmentsAPI } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalServicesReceived: 0,
    totalBookings: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        setLoading(true);
        const appointmentsRes = await appointmentsAPI.getUserAppointments();

        // Filter appointments for the current user
        const userAppointments = appointmentsRes.appointments.filter(apt =>
          apt.userId === user.id
        );

        // Filter upcoming appointments
        const upcoming = userAppointments.filter(apt =>
          new Date(apt.date) >= new Date() && apt.status !== 'CANCELLED'
        );

        // Count completed services
        const completed = userAppointments.filter(apt =>
          apt.status === 'COMPLETED'
        );

        setStats({
          upcomingAppointments: upcoming.length,
          totalServicesReceived: completed.length,
          totalBookings: userAppointments.length,
        });

        setAppointments(userAppointments.slice(0, 5)); // Show last 5 appointments
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please ensure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D7D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      {/* Sidebar - Fixed on the left */}
      <UserSidebar />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-full overflow-y-auto p-10">

        {/* HEADER WITH PERSONALIZED GREETING AND TOTAL BOOKINGS BADGE */}
        <header className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Hello, <span className="text-[#FF2D7D]">{user?.name}</span>!
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Welcome back to your beauty sanctuary</p>
            </div>

            {/* TOTAL BOOKINGS BADGE - Pink accent matching admin */}
            <div className="bg-[#FF2D7D] text-white px-6 py-3 rounded-2xl shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider opacity-90">Total Bookings</p>
              <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800">
            {error}
          </div>
        )}

        {/* STATISTICS CARDS - White cards with rounded-3xl and shadow-sm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Upcoming Appointments</p>
                <p className="text-4xl font-bold text-gray-800 mt-3">{stats.upcomingAppointments}</p>
              </div>
              <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center">
                <Calendar className="text-[#FF2D7D]" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Services Completed</p>
                <p className="text-4xl font-bold text-gray-800 mt-3">{stats.totalServicesReceived}</p>
              </div>
              <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => navigate('/booking')}
            className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-[#FF2D7D] bg-opacity-10 rounded-xl flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <Calendar className="text-[#FF2D7D]" size={24} />
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-[#FF2D7D] transition-colors" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Book New Appointment</h3>
            <p className="text-gray-500 text-sm font-medium">Schedule your next beauty treatment with our expert stylists</p>
          </div>

          <div
            onClick={() => navigate('/user/bookings')}
            className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-all">
                <Clock className="text-purple-600" size={24} />
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-purple-600 transition-colors" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">View All Bookings</h3>
            <p className="text-gray-500 text-sm font-medium">Manage and track all your appointments in one place</p>
          </div>
        </div>

        {/* RECENT APPOINTMENTS TABLE - divide-y divide-gray-50 with status pills */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-10">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Recent Appointments</h2>
            <button
              onClick={() => navigate('/user/bookings')}
              className="text-[#FF2D7D] font-bold text-sm hover:text-pink-700 transition-colors uppercase tracking-wide"
            >
              VIEW ALL
            </button>
          </div>

          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-50">
                    <th className="text-left py-4 px-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Service</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Time</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((appointment, index) => (
                    <tr key={appointment.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-800 font-medium">{appointment.serviceName || appointment.service?.name || 'Service'}</td>
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">{appointment.time || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span className={`
                          inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                          ${appointment.status === 'COMPLETED' || appointment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'CONFIRMED' || appointment.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : appointment.status === 'CANCELLED' || appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }
                        `}>
                          {appointment.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-500 font-medium mb-4">No appointments found</p>
              <p className="text-gray-400 text-sm mb-6">Book your first appointment to get started!</p>
              <button
                onClick={() => navigate('/booking')}
                className="px-8 py-3 bg-[#FF2D7D] text-white rounded-2xl hover:bg-pink-700 transition-colors font-bold shadow-lg shadow-pink-200"
              >
                Book First Appointment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
