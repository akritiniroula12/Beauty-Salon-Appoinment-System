import { useState, useEffect } from 'react';
import { FaSpinner, FaClock, FaPlus } from 'react-icons/fa';
import { servicesAPI } from '../services/api';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

// Fixed Helper function to support Base64 and standard URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // 1. If it's a Base64 string (starts with data:), return it exactly as is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  // 2. If it's a full web URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 3. If it's a relative path from your backend, prepend the backend URL
  return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getServices();
        console.log('Services fetched:', response.services);
        // Log image URLs for debugging
        response.services.forEach(service => {
          console.log(`Service: ${service.name}, Image: ${service.image}`);
        });
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
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-stone-200 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen font-sans text-stone-900">
      {/* 1. Header */}
      <header className="max-w-7xl mx-auto pt-20 pb-12 px-6 text-center">
        <span className="text-pink-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Luxury Experience</span>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-stone-900">Our Services</h1>
        <p className="mt-4 text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
          Premium beauty treatments tailored to your unique style and needs.
        </p>
      </header>

      {/* 2. Grid - Reduced pb-24 to pb-12 to tighten space */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white border border-stone-200 flex flex-col h-full transition-all duration-300 hover:border-pink-300 hover:shadow-sm group"
            >
              <div className="h-48 w-full overflow-hidden bg-stone-100 flex-shrink-0 relative">
                {service.image ? (
                  <img 
                    src={getImageUrl(service.image)} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      // If image fails to load, hide it and show placeholder
                      console.error('Image failed to load:', service.image);
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      // Ensure placeholder is hidden when image loads successfully
                      const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                      if (placeholder) placeholder.style.display = 'none';
                    }}
                  />
                ) : null}
                <div 
                  className="image-placeholder w-full h-full absolute inset-0 flex items-center justify-center text-stone-300 text-[9px] tracking-widest uppercase font-bold"
                  style={{ display: service.image ? 'none' : 'flex' }}
                >
                  Elora
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <div className="flex justify-between items-start">
                     <h3 className="text-lg font-medium tracking-wide pr-2 capitalize line-clamp-1">
                      {service.name}
                    </h3>
                    <span className="text-pink-600 font-bold text-base whitespace-nowrap">
                      Rs. {service.price}
                    </span>
                  </div>
                  <div className="flex items-center text-stone-400 text-[9px] font-bold uppercase tracking-widest mt-1">
                    <FaClock className="mr-1.5 text-pink-500/50" />
                    {service.duration} MIN
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-stone-500 text-xs leading-relaxed font-light mb-4 italic line-clamp-2">
                    "{service.description}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-auto">
                  <Link 
                    to="/booking"
                    className="flex items-center justify-between w-full group text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 hover:text-pink-600 transition-colors"
                  >
                    Book Appointment
                    <FaPlus className="text-pink-500 text-xs group-hover:rotate-90 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
{/* 3. CTA Section - Gap Fixed with Negative Margin */}
      <section className="bg-[#faf9f6] py-12 px-6">
        <div className="max-w-4xl mx-auto border border-stone-200 bg-white p-12 text-center shadow-sm mt-[-60px] relative z-10">
          <h2 className="text-3xl font-light mb-8 text-stone-900 tracking-tight">
            Need a custom consultation?
          </h2>
          
          <Link 
            to="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#f13a91] text-white text-base font-semibold rounded-full shadow-lg shadow-pink-100 transition-all duration-300 hover:bg-[#d62e7a] hover:shadow-pink-200 hover:-translate-y-1 active:scale-95 group"
          >
            <span>Get in Touch</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          
          <p className="mt-8 text-stone-400 text-[10px] uppercase tracking-[0.5em] font-medium">
            Available Sunday — Friday
          </p>
        </div>
      </section>
    </div>
  );
};

export default Services;