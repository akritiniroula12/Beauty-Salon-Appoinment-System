import { Link } from 'react-router-dom';
import { FaSpinner, FaCalendarCheck, FaStar, FaUsers, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const featuredServices = [
    {
      id: 1,
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling services',
      icon: '✂️',
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Expert hair coloring and highlights',
      icon: '🎨',
    },
    {
      id: 3,
      name: 'Facial Treatment',
      description: 'Relaxing and rejuvenating facial treatments',
      icon: '✨',
    },
  ];

  const stats = [
    { icon: FaUsers, number: '5000+', label: 'Happy Clients' },
    { icon: FaStar, number: '4.9', label: 'Average Rating' },
    { icon: FaCalendarCheck, number: '10000+', label: 'Appointments' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to Beauty Salon
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
              Your one-stop destination for all beauty and wellness services. 
              Book your appointment today and experience the luxury you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-pink-600 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Appointment
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-lg transition-shadow duration-300"
              >
                <stat.icon className="text-4xl text-pink-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Featured Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular services designed to make you look and feel your best
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 text-center">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-center mb-4">{service.description}</p>
                <Link
                  to="/services"
                  className="block text-center text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-200"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View All Services
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            Book your appointment now and experience the best beauty services in town
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center px-8 py-4 bg-white text-pink-600 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaCalendarCheck className="mr-2" />
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

