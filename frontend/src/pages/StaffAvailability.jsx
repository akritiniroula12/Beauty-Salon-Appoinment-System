import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';

const StaffAvailability = () => {
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await staffAPI.getAvailability();
                setAvailability(response.availability || {});
            } catch (error) {
                console.error('Error fetching availability:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayChange = (day, field, value) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await staffAPI.updateAvailability(availability);
            alert('Availability saved successfully!');
        } catch (error) {
            alert('Failed to save availability');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-light text-stone-900 mb-8">Manage Availability</h1>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
                <p className="text-stone-500 mb-6 text-sm">Set your working hours for each day. Leave blank if you are not working.</p>

                <div className="space-y-4">
                    {days.map(day => (
                        <div key={day} className="flex items-center gap-4 py-2 border-b border-stone-100 last:border-0">
                            <div className="w-32 font-medium text-stone-700">{day}</div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="time"
                                    value={availability[day]?.start || ''}
                                    onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                                    className="p-2 border border-stone-200 rounded text-sm focus:outline-none focus:border-pink-500"
                                />
                                <span className="text-stone-400">-</span>
                                <input
                                    type="time"
                                    value={availability[day]?.end || ''}
                                    onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                                    className="p-2 border border-stone-200 rounded text-sm focus:outline-none focus:border-pink-500"
                                />
                            </div>
                            <div className="ml-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={availability[day]?.off || false}
                                        onChange={(e) => handleDayChange(day, 'off', e.target.checked)}
                                        className="accent-pink-600"
                                    />
                                    <span className="text-sm text-stone-500">Day Off</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-[#f13a91] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#d62e7f] transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffAvailability;
