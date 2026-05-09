import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Settings, Check, X, Clock, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/vendor');
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings', error);
        setLoading(false);
      }
    };

    if (user && user.role === 'vendor') {
      fetchBookings();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map((b) => (b._id === id ? data : b)));
      toast.success(`Booking marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'vendor') return <Navigate to="/dashboard" />;
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 mb-8 text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Portal</h1>
          <p className="text-gray-300 mt-2">Manage your incoming service requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Recent Service Requests</h2>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No requests received yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-gray-900">{booking.serviceId?.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Customer:</span> {booking.customerId?.name} ({booking.customerId?.phone})
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Address:</span> {booking.address}
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-2">
                      ${booking.totalAmount}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2 min-w-[140px]">
                    {booking.status === 'Pending' && (
                      <>
                        <button onClick={() => updateStatus(booking._id, 'Accepted')} className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-bold transition-colors">
                          <Check size={16} className="mr-1" /> Accept
                        </button>
                        <button onClick={() => updateStatus(booking._id, 'Rejected')} className="w-full flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 py-2 px-4 rounded-lg text-sm font-bold transition-colors">
                          <X size={16} className="mr-1" /> Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'Accepted' && (
                      <button onClick={() => updateStatus(booking._id, 'In Progress')} className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-bold transition-colors">
                        <Play size={16} className="mr-1" /> Start Service
                      </button>
                    )}
                    {booking.status === 'In Progress' && (
                      <button onClick={() => updateStatus(booking._id, 'Completed')} className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-bold transition-colors">
                        <Check size={16} className="mr-1" /> Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
