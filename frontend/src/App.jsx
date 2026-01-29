import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';// 1. IMPORT FOOTER HERE
import Home from './pages/Home';
import Services from './pages/Services';
import BookingAppointment from './pages/BookingAppointment';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* We use flex-col and min-h-screen to make sure the footer sticks to the bottom */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          
          {/* Main content expands to fill space, pushing Footer down */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<BookingAppointment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
            </Routes>
          </div>

          <Footer /> {/* 2. PLACE FOOTER HERE. It will now show on Home, Booking, and Services! */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;