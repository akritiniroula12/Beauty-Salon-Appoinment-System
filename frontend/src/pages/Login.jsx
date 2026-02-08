import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Capture the result object from AuthContext
      const result = await login(email, password);

      // 2. Check if login was successful
      if (result.success) {
        // 3. Look inside result.user to find the role
        const currentUser = result.user;

        // Role-based redirection
        if (result.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (result.user.role === 'STAFF') {
          navigate('/staff/dashboard');
        } else {
          navigate('/user/dashboard');
        }

      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Check if it's a network error
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12 pb-20 px-6 font-sans text-stone-900 flex flex-col items-center">
      <div className="w-full max-w-md">

        {/* Header Section */}
        <div className="text-center mb-6">
          <span className="text-pink-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-2 block">
            Membership
          </span>
          <h1 className="text-5xl font-light tracking-tight text-stone-900 leading-none">
            Welcome Back
          </h1>
          <p className="mt-2 text-stone-500 font-light italic text-sm">
            Sign in to manage your appointments.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm relative z-10 mt-[-15px]">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Email Field */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 placeholder:text-stone-200 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Password
                </label>
                <Link to="/forgot-password" text-sm className="text-[10px] uppercase tracking-wider text-pink-600 hover:text-stone-900 transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 placeholder:text-stone-200 text-sm"
              />
            </div>

            {error && (
              <div className="text-center text-[10px] font-bold uppercase tracking-widest p-3 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 
                           bg-[#f13a91] text-white text-[11px] font-bold uppercase tracking-[0.3em] 
                           rounded-full shadow-lg shadow-pink-100 transition-all duration-300 
                           hover:bg-[#d62e7f] hover:shadow-xl hover:-translate-y-1 
                           active:scale-95 disabled:opacity-50 group"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-lg" />
                ) : (
                  <>
                    Sign In
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center border-t border-stone-100 pt-6">
            <p className="text-xs text-stone-400 font-light">
              Don't have an account?{' '}
              <Link to="/register" className="text-pink-600 font-bold hover:text-stone-900 transition-colors underline underline-offset-4">
                Join Elora
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Accent */}
        <p className="mt-10 text-center text-stone-400 text-[10px] uppercase tracking-[0.5em]">
          Elora Hair & Skin • Crafted for Excellence
        </p>
      </div>
    </div>
  );
};

export default Login;