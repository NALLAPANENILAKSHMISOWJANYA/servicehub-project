import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VendorLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('vendor@test.com');
  const [password, setPassword] = useState('password123');
  const { loginVendor } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginVendor(emailOrPhone, password);
      toast.success('Logged in successfully!');
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/vendor-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Welcome to ServiceHub
        </h2>

        {/* Route Tabs */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className={`flex-1 py-3 rounded-lg border-2 font-semibold text-center transition-colors border-gray-200 text-gray-500 hover:border-primary-300`}
            >
              Customer
            </Link>
            <Link
              to="/vendor/login"
              className={`flex-1 py-3 rounded-lg border-2 font-semibold text-center transition-colors border-primary-600 text-primary-600 bg-primary-50`}
            >
              Vendor
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter email or phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          >
            Login as Vendor
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          New vendor? <Link to="/vendor/signup" className="text-primary-600 font-bold hover:underline">Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
