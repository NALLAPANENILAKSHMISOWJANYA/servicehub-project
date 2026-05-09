import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
        <Link to="/" className="text-2xl font-black text-primary-900 tracking-tight flex items-center gap-1">
          <div className="bg-primary-900 text-white p-1 rounded">UC</div>
          ServiceHub
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              {/* Cart Icon (Decorative like UC) */}
              {user.role === 'customer' && (
                <button className="text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </button>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-50 py-2 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.phone || user.email}</p>
                      </div>
                      
                      <Link
                        to={user.role === 'admin' ? '/admin-dashboard' : user.role === 'vendor' ? '/vendor-dashboard' : '/dashboard'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                      >
                        {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'vendor' ? 'Vendor Dashboard' : 'My Bookings'}
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium mt-1 border-t border-gray-50 pt-3"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-bold transition-colors shadow-md"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
