import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    serviceCategory: 'Cleaning',
    address: ''
  });
  const { signupVendor } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupVendor(formData);
      toast.success('Vendor account created successfully!');
      navigate('/vendor-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Become a Partner</h2>
          <p className="text-gray-500 mt-2">Sign up to receive service bookings</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
            <select
              name="serviceCategory"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={formData.serviceCategory}
              onChange={handleChange}
            >
              <option value="Cleaning">Cleaning</option>
              <option value="Repair">Repair</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Salon">Salon</option>
              <option value="Pest Control">Pest Control</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
            <textarea
              name="address"
              required
              rows="2"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold py-3 rounded-lg shadow-md transition-all mt-4"
          >
            Create Vendor Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already a partner? <Link to="/vendor/login" className="text-primary-600 font-bold hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
