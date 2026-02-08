import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import BookingAppointment from './pages/BookingAppointment';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserBookings from './pages/UserBookings';
import UserProfile from './pages/UserProfile';
import AdminAppointments from './pages/AdminAppointments';
import AdminUsers from './pages/AdminUsers';
import AdminStaff from './pages/AdminStaff';
import AdminServices from './pages/AdminServices';
import StaffDashboard from './pages/StaffDashboard';
import StaffAppointments from './pages/StaffAppointments';
import StaffAvailability from './pages/StaffAvailability';
import StaffProfile from './pages/StaffProfile';
import ProtectedRoute from './components/ProtectedRoute';



// Component to handle conditional rendering based on location
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user');
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAdminRoute && !isUserRoute && !isStaffRoute && <Navbar />}

      {/* Main content expands to fill space, pushing Footer down */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<BookingAppointment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <UserBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminServices />
              </ProtectedRoute>
            }
          />


          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/appointments"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/availability"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StaffProfile />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>

      {!isAdminRoute && !isUserRoute && !isStaffRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;