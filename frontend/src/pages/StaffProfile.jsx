import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { staffAPI } from '../services/api';
import StaffSidebar from '../components/StaffSidebar';
import { User, Mail, FileText, Award, Save } from 'lucide-react';

const StaffProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ bio: '', skills: '', name: '', specialization: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await staffAPI.getProfile();
                if (data.staff) {
                    setProfile({
                        bio: data.staff.bio || '',
                        skills: data.staff.skills || '',
                        name: data.staff.user?.name || user?.name || '',
                        specialization: data.staff.specialization || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage({ type: 'error', text: 'Failed to load profile data' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await staffAPI.updateProfile(profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
                <StaffSidebar />
                <div className="flex items-center justify-center h-full w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D7D]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
            {/* Sidebar */}
            <StaffSidebar />

            {/* Main Content Area - Scrollable */}
            <main className="flex-1 h-full overflow-y-auto p-10">

                {/* HEADER */}
                <header className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center">
                        <div className="h-16 w-16 bg-[#FF2D7D] rounded-2xl flex items-center justify-center mr-4">
                            <User className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-gray-500 mt-1 font-medium">Manage your professional information</p>
                        </div>
                    </div>
                </header>

                {/* MESSAGE ALERT */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-2xl ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* PROFILE INFORMATION CARD */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <FileText className="mr-2 text-[#FF2D7D]" size={24} />
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NAME FIELD (Read-only) */}
                        <div>
                            <label className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                                <User size={16} className="mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium"
                            />
                        </div>

                        {/* EMAIL FIELD (Read-only) */}
                        <div>
                            <label className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                                <Mail size={16} className="mr-2" />
                                Email Address
                            </label>
                            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium">
                                    {user?.email || 'N/A'}
                                </div>
                        </div>
                    </div>
                </div>

                {/* PROFESSIONAL DETAILS CARD */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <Award className="mr-2 text-[#FF2D7D]" size={24} />
                        Professional Details
                    </h2>

                    {/* BIO FIELD */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                            Professional Bio
                        </label>
                        <textarea
                            rows="5"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF2D7D] focus:ring-2 focus:ring-pink-100 transition-all font-medium text-gray-800"
                            placeholder="Tell clients about your experience, specialties, and what makes you unique..."
                        />
                        <p className="text-xs text-gray-400 mt-2">This will be visible to clients when they book appointments</p>
                    </div>

                    {/* SPECIALIZATION FIELD */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                            Specialization
                        </label>
                        <input
                            type="text"
                            value={profile.specialization}
                            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF2D7D] focus:ring-2 focus:ring-pink-100 transition-all font-medium text-gray-800"
                            placeholder="e.g. Hair Coloring, Bridal Styling"
                        />
                        <p className="text-xs text-gray-400 mt-2">Add a short specialization or title</p>
                    </div>

                    {/* SKILLS FIELD */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                            Skills & Specialties
                        </label>
                        <input
                            type="text"
                            value={profile.skills}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF2D7D] focus:ring-2 focus:ring-pink-100 transition-all font-medium text-gray-800"
                            placeholder="e.g. Hair Coloring, Facial Treatments, Manicure, Pedicure (comma separated)"
                        />
                        <p className="text-xs text-gray-400 mt-2">Separate multiple skills with commas</p>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-8 py-4 bg-[#FF2D7D] text-white font-bold rounded-2xl hover:bg-pink-700 transition-all duration-200 shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} className="mr-2" />
                        {saving ? 'Saving Changes...' : 'Update Profile'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default StaffProfile;
