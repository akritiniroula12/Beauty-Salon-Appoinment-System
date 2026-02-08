import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Form Validation logic remains exactly as you had it
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        navigate('/'); // Redirect to Landing Page
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12 pb-20 px-6 font-sans text-stone-900 flex flex-col items-center">
      <div className="w-full max-w-md">

        {/* Header Section - Same Tight Spacing as Login */}
        <div className="text-center mb-6">
          <span className="text-pink-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-2 block">
            Join Membership
          </span>
          <h1 className="text-5xl font-light tracking-tight text-stone-900 leading-none">
            Create Account
          </h1>
          <p className="mt-2 text-stone-500 font-light italic text-sm">
            Sign up to start booking appointments.
          </p>
        </div>

        {/* Form Container - Negative margin mt-[-15px] to close the gap */}
        <div className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm relative z-10 mt-[-15px]">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Full Name Field */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 placeholder:text-stone-200 text-sm"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 placeholder:text-stone-200 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 placeholder:text-stone-200 text-sm"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-pink-500 transition-colors text-stone-800 placeholder:text-stone-200 text-sm"
              />
            </div>

            {error && (
              <div className="text-center text-[10px] font-bold uppercase tracking-widest p-3 bg-red-50 text-red-600 rounded border border-red-100">
                {error}
              </div>
            )}

            {/* Submit Button - Updated to Pink-to-Pink Hover */}
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 
                           bg-[#f13a91] text-white text-[11px] font-bold uppercase tracking-[0.3em] 
                           rounded-full shadow-lg shadow-pink-100 transition-all duration-300 
                           hover:bg-[#d62e7f] hover:shadow-xl hover:-translate-y-1 
                           active:scale-95 disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin text-lg" />
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center border-t border-stone-100 pt-6">
            <p className="text-xs text-stone-400 font-light">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-600 font-bold hover:text-stone-900 transition-colors underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-stone-400 text-[10px] uppercase tracking-[0.5em]">
          Elora Hair & Skin • Crafted for Excellence
        </p>
      </div>
    </div>
  );
};

export default Register;