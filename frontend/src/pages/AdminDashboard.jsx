import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { appointmentsAPI, servicesAPI, authAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalUsers: 0,
    totalServices: 0,
    totalRevenue: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, appointmentsRes, usersRes] = await Promise.all([
          servicesAPI.getServices(),
          appointmentsAPI.getAdminAppointments(),
          authAPI.getAllUsers()
        ]);

        const confirmedAppointments = appointmentsRes.appointments || [];
        const totalRevenue = confirmedAppointments
          .filter(apt => apt.status === 'CONFIRMED')
          .reduce((sum, apt) => {
            const price = apt.service?.price || 0;
            return sum + parseFloat(price);
          }, 0);

        setStats({
          totalServices: servicesRes.services.length,
          totalAppointments: appointmentsRes.appointments.length,
          totalUsers: usersRes.users.length,
          totalRevenue: totalRevenue,
        });

        setAppointments(appointmentsRes.appointments);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please ensure server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D7D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      {/* Sidebar remains fixed on the left */}
      <AdminSidebar />

      {/* Main Content Area - This part scrolls independently */}
      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-12">
        
        {/* Header Card */}
        <header className="bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-50">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">
            Welcome back, <span className="font-semibold text-[#FF2D7D]">{user?.name}</span>
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}

 {/* 🚀 STATS CARDS WITH REFINED FONT WEIGHT */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
  {[
    { label: 'Total Customers', value: stats.totalUsers, color: 'text-gray-900' },
    { label: 'Total Appointments', value: stats.totalAppointments, color: 'text-gray-900' },
    { label: 'Active Services', value: stats.totalServices, color: 'text-gray-900' },
   { label: 'Total Revenue', value: `Rs. ${Math.floor(stats.totalRevenue)}`, color: 'text-green-600' }
  ].map((stat, index) => (
    <div 
      key={index}
      className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 transition-colors duration-200 hover:bg-gray-50 hover:border-pink-100 cursor-default"
    >
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {stat.label}
      </h3>
      {/* Changed font-black to font-bold for a cleaner look */}
      <p className={`text-3xl font-bold ${stat.color}`}>
        {stat.value}
      </p>
    </div>
  ))}
</div>
        {/* Recent Appointments Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden mb-10">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
            <button className="text-[#FF2D7D] text-sm font-bold hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Service</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-medium italic">
                      No appointments found in the system.
                    </td>
                  </tr>
                ) : (
                  appointments.slice(0, 6).map((apt) => (
                    <tr key={apt.id || apt._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-gray-800">{apt.user?.name || 'Guest'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-gray-600">{apt.service?.name}</span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        {new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`
                          inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider
                          ${apt.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-600' :
                            apt.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                            apt.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                            'bg-orange-50 text-orange-600'}
                        `}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;