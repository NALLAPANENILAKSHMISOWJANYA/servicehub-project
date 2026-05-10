import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          api.get('/bookings/mybookings'),
          api.get('/services')
        ]);
        setBookings(bookingsRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'customer') {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'customer') return <Navigate to="/vendor-dashboard" />;
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-500 mt-1">Manage your bookings and profile</p>
        </div>
        <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500">You haven't booked any services yet. Start exploring!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 h-32 flex-shrink-0">
                <img src={booking.serviceId?.image} alt={booking.serviceId?.title} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{booking.serviceId?.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {booking.address}</div>
                  <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Provider: {booking.vendorId?.name}</div>
                  <div className="flex items-center font-bold text-primary-600 text-base">Total: ${booking.totalAmount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Services Grid */}
      <div className="mt-12 mb-8 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-gray-800">Available Services to Book</h2>
        <Link to="/" className="text-primary-600 font-bold hover:underline">View All</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {services.slice(0, 8).map((service) => (
          <Link key={service._id} to={`/services/${service._id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider text-primary-700 shadow-sm">
                {service.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{service.title}</h3>
              <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Starts From</p>
                  <span className="text-xl font-black text-gray-900">${service.price}</span>
                </div>
                <button className="bg-primary-50 text-primary-700 font-bold px-4 py-2 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  Book
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
