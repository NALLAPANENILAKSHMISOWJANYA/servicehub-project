import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setService(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service', error);
        toast.error('Service not found');
        navigate('/');
      }
    };
    fetchService();
  }, [id, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate || !address) {
      toast.error('Please provide date and address');
      return;
    }

    try {
      await api.post('/bookings', {
        serviceId: id,
        bookingDate,
        address,
      });
      toast.success('Booking requested successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating booking. Please login first.');
      if(error.response?.status === 401) {
          navigate('/login');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64 md:h-full min-h-[400px] relative">
          <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-2">
            <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
              {service.category}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{service.title}</h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {service.description}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-700">
              <Star className="text-yellow-500 mr-3" /> <span className="font-medium">4.8 Rating (120+ Reviews)</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="text-green-500 mr-3" /> <span className="font-medium">Provided by {service.vendorId?.name || 'Professional Vendor'}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">Book this Service</h3>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                <textarea
                  required
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-3xl font-extrabold text-gray-900">${service.price}</span>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
