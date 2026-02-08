import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const AdminStaff = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Filter to ensure only ADMIN users are shown
        const adminOnly = fetchedData.filter(user => user.role === 'ADMIN');
        setStaff(adminOnly);
      }
    } catch (err) {
      setError("Failed to load staff.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaShieldAlt className="mr-3 text-purple-600" /> Staff Directory
          </h1>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold">
            Total Staff: {staff.length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400">ID: {user._id || user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <FaEnvelope className="inline mr-2" /> {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;

