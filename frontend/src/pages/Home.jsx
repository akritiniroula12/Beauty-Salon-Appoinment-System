import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSpinner, 
  FaCalendarCheck, 
  FaStar, 
  FaUsers, 
  FaArrowRight, 
  FaCheckCircle,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt 
} from 'react-icons/fa';
import heroModel from '../image/hero-model.png'; 
import { servicesAPI } from '../services/api';

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getServices();
        setFeaturedServices(response.services.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-32 lg:pt-20 lg:pb-48 bg-[#fff1f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 text-left">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[2px] bg-pink-500"></span>
                <span className="text-pink-600 font-bold uppercase tracking-widest text-xs">Full Service Salon</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-8">
                Redefine Your <br /> 
                <span className="text-pink-500 font-serif italic font-normal">Beauty & Style</span> <br />
                From Head to Toe
              </h1>
              <ul className="space-y-4 mb-10 text-gray-700">
                <li className="flex items-center gap-3 font-medium">
                  <FaCheckCircle className="text-pink-500" /> Expert Hair Styling, Cutting & Color
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <FaCheckCircle className="text-pink-500" /> Premium Skin & Facial Treatments
                </li>
              </ul>
              <Link to="/booking" className="px-10 py-4 bg-pink-500 text-white rounded-full font-bold shadow-xl shadow-pink-200 hover:bg-pink-600 transition-all inline-block hover:-translate-y-1">
                Book Appointment
              </Link>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <img 
                src={heroModel} 
                alt="Salon Services" 
                className="w-full max-w-lg rounded-[2.5rem] shadow-2xl object-cover aspect-[4/3]" 
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[100%] h-[100px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,112.49,123.39,110.13,182.39,95.8,241.39,81.46,282.39,64.91,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. FEATURED SERVICES */}
      <section className="py-24 bg-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Our <span className="text-gray-900">Signature</span> Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Discover our most popular services designed to make you look and feel your best at Elora.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-4xl text-pink-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div key={service.id} className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-[0_20px_50px_rgba(236,72,153,0.12)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors uppercase tracking-tight">
                      {service.name}
                    </h3>
                    <p className="text-gray-500 mb-6 leading-relaxed line-clamp-3 italic">
                      {service.description}
                    </p>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="text-pink-500">Rs. {service.price}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{service.duration} MIN</span>
                    </div>
                  </div>
                  <Link to="/services" className="inline-flex items-center text-pink-600 font-bold hover:text-pink-700 transition-all border-t border-gray-50 pt-6 group-hover:gap-3 gap-2">
                    Learn More <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <Link to="/services" className="px-10 py-4 bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all inline-flex items-center gap-2">
              View All Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. LIGHT NEUTRAL CTA */}
      <section className="py-24 bg-[#FAF9F6] border-y border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 flex justify-center items-center gap-4">
            <span className="h-px w-12 bg-neutral-300"></span>
            <span className="text-neutral-400 uppercase tracking-[0.3em] text-xs font-bold">Your Invitation</span>
            <span className="h-px w-12 bg-neutral-300"></span>
          </div>
          <h2 className="text-4xl md:text-4xl font-bold text-neutral-800 mb-6 tracking-tight">
            Ready to <span className="text-pink-500 font-serif italic font-normal">Transform</span> Your Look?
          </h2>
          <p className="text-lg mb-10 text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of luxury and expertise. Book your exclusive session at Elora today.
          </p>
          <Link to="/booking" className="inline-flex items-center px-10 py-4 bg-pink-500 text-white rounded-full font-bold text-lg hover:bg-pink-600 transition-all duration-300 shadow-xl shadow-pink-200 hover:-translate-y-1">
            <FaCalendarCheck className="mr-3" />
            Book Your Session
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
