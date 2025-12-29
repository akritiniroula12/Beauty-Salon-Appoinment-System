import { FaSpinner, FaStar, FaClock } from 'react-icons/fa';
// Import your images here. Add more imports as needed.
import haircoloringImage from '../image/haircoloring.jpg';

const Services = () => {
  // Helper function to check if the image is a file path
  const isImageFile = (image) => {
    return typeof image === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(image);
  };

  // Map of image filenames to imported images
  const imageMap = {
    'haircoloring.jpg': haircoloringImage,
    // Add more image mappings here as you add images
    // 'your-image.jpg': yourImageImport,
  };

  const services = [
    {
      id: 1,
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling services tailored to your preferences. Our expert stylists will help you achieve the perfect look.',
      price: 'Rs.950',
      duration: '45 min',
      image: '✂️', // You can use emoji OR image file name (e.g., 'haircut.jpg')
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Expert hair coloring and highlights using premium products. Transform your look with vibrant colors or subtle highlights.',
      price: 'Rs.1200',
      duration: '2 hours',
      image: 'haircoloring.jpg', // Use image filename for actual images
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Facial Treatment',
      description: 'Relaxing and rejuvenating facial treatments designed to refresh and revitalize your skin. Perfect for all skin types.',
      price: 'Rs.1000',
      duration: '60 min',
      image: '✨', // Or use emoji
      rating: 4.9,
    },
    {
      id: 4,
      name: 'Manicure & Pedicure',
      description: 'Complete nail care services including manicure and pedicure. Choose from a variety of colors and designs.',
      price: 'Rs.600',
      duration: '90 min',
      image: '💅',
      rating: 4.7,
    },
    {
      id: 5,
      name: 'Hair Treatment',
      description: 'Deep conditioning and repair treatments for damaged hair. Restore shine and strength to your locks.',
      price: 'Rs.2270',
      duration: '60 min',
      image: '💆',
      rating: 4.8,
    },
    {
      id: 6,
      name: 'Makeup Services',
      description: 'Professional makeup application for special events, weddings, or everyday glam. Our makeup artists will enhance your natural beauty.',
      price: 'Rs.3990',
      duration: '90 min',
      image: '💄',
      rating: 4.9,
    },
  ];

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
              {/* Service Image/Icon */}
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-8 text-center">
                {isImageFile(service.image) ? (
                  <img 
                    src={imageMap[service.image]} 
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="text-6xl mb-4">{service.image}</div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <FaStar className="text-sm" />
                    <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaClock className="text-pink-600" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-800">
                    <span className="text-lg font-bold">{service.price}</span>
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

