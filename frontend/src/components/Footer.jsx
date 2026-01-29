import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-8">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-light tracking-[0.3em] uppercase mb-1">Elora</h3>
            <p className="text-pink-500 font-bold text-[10px] tracking-[0.5em] uppercase mb-4">Hair & Skin</p>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Expert beauty services delivered with precision and luxury.
            </p>
          </div>

          {/* 2. Navigation */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-light tracking-[0.3em] uppercase mb-4">Navigation</h4>
            <ul className="text-gray-400 text-xs space-y-2 text-center">
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-pink-500 transition-colors">Services</Link></li>
              <li><Link to="/booking" className="hover:text-pink-500 transition-colors">Book Now</Link></li>
            </ul>
          </div>

          {/* 3. Contact */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact</h4>
            <ul className="text-gray-400 text-xs space-y-2">
              <li className="hover:text-pink-500 transition-colors">9876543211</li>
              <li className="hover:text-pink-500 transition-colors italic lowercase">elorahairandskin@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">
            © 2026 ELORA HAIR & SKIN • CRAFTED FOR EXCELLENCE
          </p>
          <div className="flex gap-6">
             <a href="#" className="text-gray-500 hover:text-white transition-colors"><FaInstagram size={18}/></a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors"><FaFacebookF size={18}/></a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors"><FaWhatsapp size={18}/></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;