import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, servicesAPI } from '../services/api';

const BookingAppointment = () => {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getServices();
        setServices(response.services);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setSubmitMessage('Failed to load services.');
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    ...services.map(service => ({
      value: service.id.toString(),
      label: `${service.name} — Rs. ${service.price} (${service.duration} min)`
    }))
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!isAuthenticated) {
      setSubmitMessage('Please login to book.');
      setIsSubmitting(false);
      return;
    }

    try {
      const [hours, minutes] = formData.time.split(':');
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await appointmentsAPI.createAppointment({
        serviceId: parseInt(formData.serviceId),
        appointmentDate: appointmentDate.toISOString(),
        notes: formData.notes || '',
        userId: user.id, // Include the logged-in user's ID
      });
      
      setSubmitMessage('Appointment booked successfully!');
      setFormData({ serviceId: '', date: '', time: '', notes: '' });
    } catch (error) {
      setSubmitMessage('Failed to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12 pb-16 px-6 font-sans text-stone-900 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        
        {/* Tight Header Section */}
        <div className="text-center mb-6">
          <span className="text-pink-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-2 block">
            Reservation
          </span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-stone-900 leading-none">
            Book Session
          </h1>
          <p className="mt-2 text-stone-500 font-light italic text-sm">
            Take a moment for yourself at Elora.
          </p>
        </div>

        {/* Form Container with Negative Margin to pull it up */}
        <div className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm relative z-10 mt-[-10px]">
          
          {isAuthenticated && user && (
            <div className="mb-8 pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Guest</p>
                <p className="text-sm font-medium text-stone-800">{user.name}</p>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">Treatment</label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 cursor-pointer"
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">Time</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">Special Requests</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={1}
                placeholder="Preferences..."
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors resize-none placeholder:text-stone-300 text-sm"
              />
            </div>

            {submitMessage && (
              <div className={`text-center text-[10px] font-bold uppercase tracking-widest p-3 rounded ${
                submitMessage.includes('successfully') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {submitMessage}
              </div>
            )}

            <div className="text-center pt-2">
              {/* Updated Button for BookingAppointment.jsx */}
<button
  type="submit"
  disabled={isSubmitting}
  className="inline-flex items-center gap-3 px-12 py-3.5 
             bg-[#f13a91] text-white text-[11px] font-bold uppercase tracking-[0.3em] 
             rounded-full shadow-lg shadow-pink-100 transition-all duration-300 
             hover:bg-[#d62e7f] hover:shadow-xl hover:-translate-y-1 
             active:scale-95 disabled:opacity-50 group"
>
  {isSubmitting ? (
    <FaSpinner className="animate-spin" />
  ) : (
    <>
      Confirm Booking 
      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )}
</button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-stone-400 text-[10px] uppercase tracking-[0.5em]">
          Elora Hair & Skin
        </p>
      </div>
    </div>
  );
};

export default BookingAppointment;