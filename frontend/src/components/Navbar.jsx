import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaCalendarAlt, FaUser, FaSignInAlt, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logoImg from '../image/logo.png'; // Ensure this path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/booking', label: 'Book Appointment' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-[100] border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-200 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity rounded-full"></div>
              <img
                src={logoImg}
                alt="Elora Logo"
                className="h-16 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="ml-4 flex flex-col border-l border-gray-100 pl-4">
              <span className="text-2xl font-light text-gray-900 tracking-[0.15em] uppercase leading-none">
                Elora
              </span>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.3em] mt-1.5 leading-none">
                Hair & Skin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive(link.path)
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-600 hover:text-pink-500 hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-gray-50 p-1 rounded-full border border-gray-100 pl-4">
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-xs leading-none">Hi, {user?.name}</p>
                  <Link
                    to={role === 'ADMIN' ? '/admin/dashboard' : role === 'STAFF' ? '/staff/dashboard' : '/user/dashboard'}
                    className="text-[10px] text-pink-500 font-bold uppercase hover:underline"
                  >
                    Go to Dashboard
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white p-2 rounded-full shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-5 py-2 text-gray-700 font-bold hover:text-pink-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all transform hover:-translate-y-0.5">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-pink-50 absolute w-full left-0 shadow-xl z-[101]">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold text-gray-800 hover:text-pink-600"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              {!isAuthenticated && (
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full py-3 bg-pink-500 text-white text-center rounded-xl font-bold shadow-lg">
                  Register Now
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;