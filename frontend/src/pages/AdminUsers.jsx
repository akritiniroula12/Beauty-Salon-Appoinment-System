import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Trash2, Mail, Users } from 'lucide-react';

const AdminUsers = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for the search bar

  // --- YOUR ORIGINAL SECURITY LOGIC ---
  useEffect(() => {
    if (!user || role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  useEffect(() => {
    if (user && role === 'ADMIN') {
      fetchUsers();
    }
  }, [user, role]);

  // --- YOUR ORIGINAL FETCH FUNCTION ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getAllUsers();
      const fetchedData = res.users || res.data || res;
      if (Array.isArray(fetchedData)) {
        const customersOnly = fetchedData.filter(user => user.role === 'CUSTOMER');
        setUsers(customersOnly);
      }
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // --- YOUR ORIGINAL DELETE FUNCTION ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await authAPI.deleteUser(id);
        setUsers(users.filter(user => (user._id || user.id) !== id));
        alert("User deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to delete user.";
        alert(errorMessage);
      }
    }
  };

  // Logic to make the new search bar work
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-[#FF2D7D] font-bold">
      Loading Elora Customers...
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      {/* Sidebar added for navigation consistency */}
      <AdminSidebar />
      
      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-12">
        {/* Elora Style Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-[#FF2D7D]" size={28} />
              <h1 className="text-3xl font-bold text-gray-800">Customer Directory</h1>
            </div>
            <p className="text-gray-500">Manage and view your salon's client base</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-pink-50 text-[#FF2D7D] px-4 py-2 rounded-xl text-sm font-bold border border-pink-100">
              Total: {users.length}
            </div>
          </div>
        </header>

        {/* Premium Styled Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Information</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Role</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Bookings</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id || u.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-pink-50 text-[#FF2D7D] flex items-center justify-center font-bold mr-4 group-hover:bg-[#FF2D7D] group-hover:text-white transition-all">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{u.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium tracking-tight">ID: {u._id || u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {u.email}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`h-8 w-8 inline-flex items-center justify-center rounded-lg font-bold text-xs ${u.appointmentCount > 0 ? 'bg-pink-50 text-[#FF2D7D]' : 'bg-gray-50 text-gray-400'}`}>
                          {u.appointmentCount || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(u._id || u.id, u.name)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-gray-400 italic">
                      No customers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;