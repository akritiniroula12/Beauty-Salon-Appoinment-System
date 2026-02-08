import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Mail, ShieldCheck, Search, Plus, X, Lock, User, Briefcase } from 'lucide-react';

const AdminStaff = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for Add Staff Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleDescription: 'Stylist',
    specialization: '',
    bio: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user || role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  useEffect(() => {
    if (user && role === 'ADMIN') {
      fetchStaff();
    }
  }, [user, role]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getAllStaff();
      const fetchedData = res.users || res.data || res;
      if (Array.isArray(fetchedData)) {
        setStaff(fetchedData);
      }
    } catch (err) {
      setError("Failed to load staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await authAPI.createStaff(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        roleDescription: 'Stylist',
        specialization: '',
        bio: ''
      });
      fetchStaff(); // Refresh the list
      alert("Staff member added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add staff member.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredStaff = staff.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roleDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-[#FF2D7D] font-bold">
      Loading Elora Staff...
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <AdminSidebar />

      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-[#FF2D7D]" size={28} />
              <h1 className="text-3xl font-bold text-gray-800">Staff Directory</h1>
            </div>
            <p className="text-gray-500">View and manage your administrative and styling team</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search staff..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF2D7D] hover:bg-[#E0266B] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-pink-100 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Add Member
            </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Team Member</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Information</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Position</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-pink-50 text-[#FF2D7D] flex items-center justify-center font-bold mr-4 group-hover:bg-[#FF2D7D] group-hover:text-white transition-all">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{u.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium tracking-tight">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {u.email}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm">
                        <span className="font-bold text-gray-700">{u.roleDescription}</span>
                        {u.specialization && <span className="block text-xs text-gray-400">{u.specialization}</span>}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-10 text-center text-gray-400 italic">
                      No staff members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Staff Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Add Team Member</h2>
                  <p className="text-sm text-gray-500 mt-1">Create a new staff account</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <div className="space-y-4">
                  {/* Name */}
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF2D7D] transition-colors" size={18} />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF2D7D] transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF2D7D] transition-colors" size={18} />
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Default Password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Position/Role Description */}
                  <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF2D7D] transition-colors" size={18} />
                    <select
                      name="roleDescription"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium appearance-none"
                      value={formData.roleDescription}
                      onChange={handleInputChange}
                    >
                      <option value="Stylist">Stylist</option>
                      <option value="Manager">Manager</option>
                      <option value="Senior Artist">Senior Artist</option>
                      <option value="Receptionist">Receptionist</option>
                    </select>
                  </div>

                  {/* Specialization */}
                  <div className="relative group">
                    <input
                      type="text"
                      name="specialization"
                      placeholder="Specialization (e.g. Nail Art, Hair Color)"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-[#FF2D7D] hover:bg-[#E0266B] disabled:opacity-50 text-white py-3 rounded-2xl text-sm font-bold shadow-lg shadow-pink-100 transition-all"
                  >
                    {formLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStaff;
