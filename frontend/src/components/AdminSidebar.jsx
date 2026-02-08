import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../image/logo.png'; 
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Scissors,
  LogOut,
  Menu,
  X,
  Globe
} from 'lucide-react';

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Getting user data for the profile circle
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Elora' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Customers' },
    { path: '/admin/staff', icon: UserCheck, label: 'Staff' },
    { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/admin/services', icon: Scissors, label: 'Services' },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button remains the same */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      `}>
        <div className="flex flex-col h-full">
          
          {/* LOGO SECTION with Pulsing Live Indicator */}
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
              <p className="text-[10px] font-bold tracking-[0.4em] text-[#FF2D7D] uppercase">Admin Panel</p>
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
                  className={`relative flex items-center px-8 py-4 transition-all duration-200 group
                    ${active ? 'bg-[#FF2D7D] text-white rounded-r-full shadow-md' : 'text-gray-500 hover:text-[#FF2D7D] hover:bg-pink-50'}`}
                >
                  <item.icon size={20} className={`mr-4 ${active ? 'text-white' : 'text-gray-400 group-hover:text-[#FF2D7D]'}`} />
                  <span className={`font-medium text-sm ${active ? 'font-bold' : ''}`}>{item.label}</span>
                </Link>
              );
            })}

            {/* KEEPING THE VISIT SITE LINK HERE */}
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-8 py-4 text-gray-500 hover:text-[#FF2D7D] hover:bg-pink-50 transition-all group"
            >
              <Globe size={20} className="mr-4 text-gray-400 group-hover:text-[#FF2D7D]" />
              <span className="font-medium text-sm">View Site</span>
            </a>
          </nav>

          {/* BOTTOM PROFILE & LOGOUT AREA */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/30">
            {/* New Profile Section */}
            <div className="flex items-center mb-6 px-2">
              <div className="h-10 w-10 rounded-full bg-[#FF2D7D] flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-pink-50">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-tight">System Admin</p>
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

export default AdminSidebar;