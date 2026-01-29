import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, servicesAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

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
        setSubmitMessage('Failed to load services. Please try again.');
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
      label: `${service.name} - ${formatCurrency(service.price)} (${service.duration} min)`
    }))
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setSubmitMessage('Please login to book an appointment');
      setIsSubmitting(false);
      return;
    }

    // Validate form
    if (!formData.serviceId || !formData.date || !formData.time) {
      setSubmitMessage('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Validate date (should be today or future)
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setSubmitMessage('Please select a future date');
      setIsSubmitting(false);
      return;
    }

    try {
      // Combine date and time into appointmentDate
      const [hours, minutes] = formData.time.split(':');
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        serviceId: parseInt(formData.serviceId),
        appointmentDate: appointmentDate.toISOString(),
        notes: formData.notes || '',
      };

      const response = await appointmentsAPI.createAppointment(appointmentData);
      
      setSubmitMessage('Appointment booked successfully!');
      setFormData({
        serviceId: '',
        date: '',
        time: '',
        notes: '',
      });
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitMessage(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600">
            Fill in the details below to schedule your visit
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info Display */}
            {isAuthenticated && user && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Booking for: <span className="font-medium text-gray-800">{user.name}</span> ({user.email})
                </p>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                <FaSpinner className="inline mr-2 text-pink-600" />
                Select Service
              </label>
              <select
                id="serviceId"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
                disabled={loadingServices}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                {serviceOptions.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
              {loadingServices && <p className="text-sm text-gray-500 mt-1">Loading services...</p>}
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-pink-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Time Field */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-pink-600" />
                  Select Time
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Any special requests or notes..."
              />
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-4 rounded-lg ${
                  submitMessage.includes('successfully')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Booking...
                </span>
              ) : (
                'Book Appointment'
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:info@beautysalon.com" className="text-pink-600 hover:text-pink-700 font-semibold">
              info@beautysalon.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingAppointment;

