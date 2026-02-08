import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';

const StaffAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const response = await staffAPI.getAppointments();
            setAppointments(response.appointments || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Mark appointment as ${newStatus}?`)) return;
        try {
            await staffAPI.updateAppointmentStatus(id, newStatus);
            fetchAppointments(); // Refresh list
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-light text-stone-900 mb-8">My Appointments</h1>

            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#faf9f6] border-b border-stone-200">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-400">Date & Time</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-400">Client</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-400">Service</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-400">Status</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-stone-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-stone-400 italic">No appointments found.</td>
                            </tr>
                        ) : (
                            appointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-[#faf9f6] transition-colors">
                                    <td className="p-4 text-sm text-stone-900">
                                        {new Date(apt.appointmentDate).toLocaleDateString()} <br />
                                        <span className="text-stone-500 text-xs">{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="p-4 text-sm text-stone-900">
                                        {apt.user.name} <br />
                                        <span className="text-stone-400 text-xs">{apt.user.email}</span>
                                    </td>
                                    <td className="p-4 text-sm text-stone-900">{apt.service.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full 
                      ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}
                                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffAppointments;
