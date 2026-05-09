import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const sendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Since Firebase requires a credit card to send SMS, we are using a mock flow
    toast.success('Mock OTP sent to ' + phone + ' (Use 123456)');
    setOtpSent(true);
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      if (otp !== '123456') {
        toast.error('Invalid OTP. Please use 123456');
        return;
      }
      
      const firebaseUid = 'mock_firebase_uid_' + phone;
      await login(firebaseUid, phone, name, 'customer');
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid OTP');
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
              className={`flex-1 py-3 rounded-lg border-2 font-semibold text-center transition-colors border-primary-600 text-primary-600 bg-primary-50`}
            >
              Customer
            </Link>
            <Link
              to="/vendor/login"
              className={`flex-1 py-3 rounded-lg border-2 font-semibold text-center transition-colors border-gray-200 text-gray-500 hover:border-primary-300`}
            >
              Vendor
            </Link>
          </div>
        </div>
        
        {/* Customer OTP Form */}
        {!otpSent ? (
          <form onSubmit={sendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (New User)</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-md transition-all">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 text-center tracking-widest text-2xl rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="------"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2 text-center">Wait for the SMS code!</p>
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-md transition-all">
              Verify & Login
            </button>
            <button type="button" onClick={() => setOtpSent(false)} className="w-full bg-white text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-lg border border-gray-200 transition-all">
              Back
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
