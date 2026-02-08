import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import { authAPI, appointmentsAPI } from '../services/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Dynamic data for Additional Information section
  const [appointmentStats, setAppointmentStats] = useState({
    completedCount: 0,
    mostRecentService: null,
    loading: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });

      // Fetch appointment data for dynamic Additional Information section
      fetchAppointmentData();
    }
  }, [user]);

  const fetchAppointmentData = async () => {
    try {
      const response = await appointmentsAPI.getUserAppointments();
      const userAppointments = response.appointments || [];

      // Filter appointments for current user
      const myAppointments = userAppointments.filter(apt => apt.userId === user.id);

      // Count completed appointments
      const completedAppointments = myAppointments.filter(apt =>
        apt.status?.toLowerCase() === 'completed'
      );

      // Get most recent appointment (any status)
      const sortedAppointments = myAppointments.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
      const mostRecent = sortedAppointments[0] || null;

      setAppointmentStats({
        completedCount: completedAppointments.length,
        mostRecentService: mostRecent,
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch appointment data:', error);
      setAppointmentStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setMessage('');
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage('Name and email are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updateUser(user.id, formData);

      // Update user in context and localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (updateUser) {
        updateUser(updatedUser);
      }

      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-8">

        {/* Header */}
        <header className="bg-white shadow-md rounded-xl mb-6 flex-shrink-0">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-[#FF2D7D] rounded-full flex items-center justify-center shadow-lg shadow-pink-100">
                <FaUser className="text-4xl text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
                <p className="text-gray-600">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 bg-[#FF2D7D] text-white rounded-xl hover:bg-[#e0266d] transition-all duration-300 font-bold flex items-center space-x-2 shadow-md shadow-pink-100"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold flex items-center space-x-2 disabled:opacity-50"
                  >
                    <FaSave />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <FaUser className="text-pink-600" />
                  <span>Full Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.name || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <FaEnvelope className="text-pink-600" />
                  <span>Email Address</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.email || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone Field - Commented out as backend schema doesn't support it yet
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <FaPhone className="text-pink-600" />
                  <span>Phone Number</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    disabled
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.phone || 'Not provided'}
                  </div>
                )}
              </div>
              */}

              {/* Account Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Information</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Role:</span> {user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Preferences Card - Pink */}
                <div className="p-6 bg-pink-50 rounded-xl border border-pink-100 shadow-sm">
                  <h4 className="font-bold text-pink-800 mb-3 text-base">Booking Preferences</h4>
                  {appointmentStats.loading ? (
                    <p className="text-sm text-pink-600">Loading preferences...</p>
                  ) : appointmentStats.mostRecentService ? (
                    <div>
                      <p className="text-sm font-semibold text-pink-700 mb-1">Last Recorded Preference:</p>
                      <p className="text-sm text-pink-600">
                        <span className="font-medium">Last Service:</span> {appointmentStats.mostRecentService.serviceName || 'Service'}
                      </p>
                      {appointmentStats.mostRecentService.notes && (
                        <p className="text-xs text-pink-500 mt-2 italic">
                          Note: {appointmentStats.mostRecentService.notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-pink-600">Book your first appointment to set your preferences!</p>
                  )}
                </div>

                {/* Loyalty Status Card - Purple */}
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
                  <h4 className="font-bold text-purple-800 mb-3 text-base">Loyalty Status</h4>
                  {appointmentStats.loading ? (
                    <p className="text-sm text-purple-600">Loading status...</p>
                  ) : (
                    <div>
                      {appointmentStats.completedCount === 0 ? (
                        <p className="text-sm text-purple-600">
                          Start your beauty journey with Elora to unlock exclusive rewards
                        </p>
                      ) : appointmentStats.completedCount >= 1 && appointmentStats.completedCount <= 5 ? (
                        <div>
                          <p className="text-sm font-semibold text-purple-700 mb-1">Silver Member</p>
                          <p className="text-sm text-purple-600">
                            You are <span className="font-bold">{6 - appointmentStats.completedCount}</span> booking{6 - appointmentStats.completedCount !== 1 ? 's' : ''} away from a VIP discount!
                          </p>
                          <div className="mt-3 bg-purple-100 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(appointmentStats.completedCount / 6) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-purple-700 mb-1">🌟 VIP Member</p>
                          <p className="text-sm text-purple-600">
                            Congratulations! You've unlocked VIP status with {appointmentStats.completedCount} completed bookings!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
