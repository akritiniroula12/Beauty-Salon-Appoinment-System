import { useState, useEffect } from 'react';
import { FaSpinner, FaClock } from 'react-icons/fa';
import { servicesAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getServices();
        setServices(response.services);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of beauty and wellness services designed to make you look and feel amazing
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Service Image */}
              {service.image ? (
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">No Image Available</span>
                </div>
              )}

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.name}</h3>

                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaClock className="text-pink-600" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-800">
                    <p className="text-lg font-bold">Rs. {service.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/booking'}
                  className="w-full py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Book Your Appointment?</h2>
            <p className="text-xl mb-6 text-pink-100">
              Choose from our wide range of services and schedule your visit today
            </p>
            <a
              href="/booking"
              className="inline-flex items-center px-8 py-4 bg-white text-pink-600 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

