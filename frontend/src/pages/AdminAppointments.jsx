import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
// 1. ADD CheckCircle HERE
import { Search, CheckCircle } from 'lucide-react'; 

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. THIS FUNCTION WAS MISSING - IT HANDLES THE CLICKS
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentsAPI.updateAppointmentStatus(id, newStatus);
      // Refresh the data so the status badge changes color
      const res = await appointmentsAPI.getAdminAppointments();
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Could not update status");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await appointmentsAPI.getAdminAppointments();
        setAppointments(res.appointments || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredAppointments = appointments.filter(app => 
    app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.service?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-screen text-[#FF2D7D] font-bold">Loading...</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <AdminSidebar />
      
      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-50">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Appointment List</h1>
            <p className="text-gray-500 mt-2">Track and manage your salon bookings</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-pink-50 text-[#FF2D7D] px-4 py-2 rounded-xl text-sm font-bold border border-pink-100">
              Total: {appointments.length}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Service</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAppointments.map((app) => (
                  <tr key={app.id || app._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-pink-50 text-[#FF2D7D] flex items-center justify-center font-bold mr-3 text-xs border border-pink-100">
                          {app.user?.name?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <span className="text-sm font-bold text-gray-800">{app.user?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600">{app.service?.name}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-700">
                      {app.appointmentDate ? new Date(app.appointmentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        app.status === 'CONFIRMED' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : app.status === 'COMPLETED'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}>
                        {app.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right flex justify-end space-x-2">
                      {app.status === 'PENDING' && (
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'CONFIRMED')}
                          className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                          title="Confirm"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {app.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'COMPLETED')}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Complete"
                        >
                          <CheckCircle size={18} className="text-blue-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAppointments;