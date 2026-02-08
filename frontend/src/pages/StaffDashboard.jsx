import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import StaffSidebar from '../components/StaffSidebar';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const StaffDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await staffAPI.getDashboardStats();
                setStats(response.stats); // Adjust based on actual API response structure
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
            {/* Sidebar remains fixed */}
            <StaffSidebar />

            {/* Main Content Area - Now correctly handles internal scroll */}
            <main className="flex-1 h-full overflow-y-auto p-10">

                {/* HEADER WITH PERSONALIZED GREETING */}
                <header className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome back, <span className="text-[#FF2D7D]">{user?.name}</span>!
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium">Here's your schedule overview for today</p>
                        </div>

                        {/* TOTAL APPOINTMENTS BADGE */}
                        <div className="bg-[#FF2D7D] text-white px-6 py-3 rounded-2xl shadow-lg">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-90">Total Upcoming</p>
                            <p className="text-3xl font-bold mt-1">{stats?.upcoming || 0}</p>
                        </div>
                    </div>
                </header>

                {/* STATISTICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Today's Appointments</p>
                                <p className="text-4xl font-bold text-gray-800 mt-3">{stats?.today || 0}</p>
                            </div>
                            <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center">
                                <Calendar className="text-[#FF2D7D]" size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Upcoming Total</p>
                                <p className="text-4xl font-bold text-gray-800 mt-3">{stats?.upcoming || 0}</p>
                            </div>
                            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Clock className="text-blue-500" size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Pending Actions</p>
                                <p className="text-4xl font-bold text-gray-800 mt-3">{stats?.pending || 0}</p>
                            </div>
                            <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                                <AlertCircle className="text-orange-500" size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* WELCOME INFO CARD */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-10">
                    <div className="flex items-start">
                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Quick Start Guide</h2>
                            <p className="text-gray-600 font-medium mb-4">
                                Manage your schedule and appointments from here. View your daily agenda in the Appointments tab.
                            </p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-[#FF2D7D] rounded-full mr-3"></span>
                                    <span className="font-medium">Check your appointments for today and upcoming days</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-[#FF2D7D] rounded-full mr-3"></span>
                                    <span className="font-medium">Update your availability to help clients book with you</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-[#FF2D7D] rounded-full mr-3"></span>
                                    <span className="font-medium">Keep your profile updated with your latest skills and bio</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;