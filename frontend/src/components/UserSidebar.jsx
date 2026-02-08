import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  // Getting user data for the profile circle
  const userData = user || JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const menuItems = [
    { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/user/bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/user/profile', icon: User, label: 'Profile' },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      `}>
        <div className="flex flex-col h-full">

          {/* LOGO SECTION */}
          <div className="pt-12 pb-8 flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-2">
              <img src={logo} alt="Elora Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-serif tracking-[0.2em] text-[#d4af37]">ELORA</h2>

            <div className="flex items-center mt-1">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[10px] font-bold tracking-[0.4em] text-[#FF2D7D] uppercase">Client Portal</p>
            </div>
          </div>

          {/* MAIN NAVIGATION */}
          <nav className="flex-1 px-0 space-y-1 mt-4 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isActiveLink(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative flex items-center px-8 py-4 transition-all duration-200 group
                    ${active ? 'bg-[#FF2D7D] text-white rounded-r-full shadow-md' : 'text-gray-500 hover:text-[#FF2D7D] hover:bg-pink-50'}`}
                >
                  <item.icon size={20} className={`mr-4 ${active ? 'text-white' : 'text-gray-400 group-hover:text-[#FF2D7D]'}`} />
                  <span className={`font-medium text-sm ${active ? 'font-bold' : ''}`}>{item.label}</span>
                </Link>
              );
            })}

            {/* HOME LINK */}
            <a
              href="/"
              className="flex items-center px-8 py-4 text-gray-500 hover:text-[#FF2D7D] hover:bg-pink-50 transition-all group"
            >
              <Home size={20} className="mr-4 text-gray-400 group-hover:text-[#FF2D7D]" />
              <span className="font-medium text-sm">Back to Home</span>
            </a>
          </nav>

          {/* BOTTOM PROFILE & LOGOUT AREA */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/30">
            {/* Profile Section */}
            <div className="flex items-center mb-6 px-2">
              <div className="h-10 w-10 rounded-full bg-[#FF2D7D] flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-pink-50">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-800">{userData.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-tight">Client</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 text-[#FF2D7D] hover:text-pink-700 font-bold text-xs tracking-widest uppercase transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default UserSidebar;
