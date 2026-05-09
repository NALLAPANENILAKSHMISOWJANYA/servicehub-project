import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Home as HomeIcon, PenTool, Droplets, Zap, Scissors, Bug } from 'lucide-react';
import api from '../services/api';

const categories = [
  { name: 'Cleaning', icon: <Droplets size={24} /> },
  { name: 'Repair', icon: <PenTool size={24} /> },
  { name: 'Plumbing', icon: <Droplets size={24} /> },
  { name: 'Electrical', icon: <Zap size={24} /> },
  { name: 'Salon', icon: <Scissors size={24} /> },
  { name: 'Pest Control', icon: <Bug size={24} /> },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const url = activeCategory 
            ? `/services?category=${activeCategory}`
            : `/services?keyword=${keyword}`;
        const { data } = await api.get(url);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };
    fetchServices();
  }, [keyword, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 -mt-8">
      {/* MMT Style Hero Background */}
      <div 
        className="h-[400px] w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-transparent"></div>
      </div>

      {/* Overlapping Search Card (MMT Style) */}
      <div className="max-w-6xl mx-auto px-4 relative -mt-[250px] mb-16 z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Category Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 bg-white">
            <button 
              onClick={() => setActiveCategory('')}
              className={`flex-1 min-w-[120px] py-4 px-6 flex flex-col items-center justify-center gap-2 transition-colors ${activeCategory === '' ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50/30' : 'text-gray-500 hover:text-primary-500 hover:bg-gray-50'}`}
            >
              <HomeIcon size={24} />
              <span className="text-sm font-bold">All Services</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-1 min-w-[120px] py-4 px-6 flex flex-col items-center justify-center gap-2 transition-colors ${activeCategory === cat.name ? 'border-b-4 border-primary-600 text-primary-600 bg-primary-50/30' : 'text-gray-500 hover:text-primary-500 hover:bg-gray-50'}`}
              >
                {cat.icon}
                <span className="text-sm font-bold">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Search Area */}
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-4 relative">
            <div className="flex-1 w-full relative group">
              <label className="absolute top-3 left-4 text-xs font-bold text-gray-500 uppercase tracking-wider z-10">Search For</label>
              <input
                type="text"
                placeholder="e.g. AC Repair, Home Cleaning..."
                className="w-full pt-8 pb-3 pl-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-0 text-lg font-bold text-gray-900 transition-colors bg-white relative hover:bg-gray-50 focus:bg-white"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={24} />
            </div>
            
            <button 
              className="w-full md:w-auto bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-extrabold text-xl py-5 px-12 rounded-full shadow-[0_10px_20px_-10px_rgba(37,99,235,0.7)] transition-all transform hover:-translate-y-1"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center">
          {activeCategory ? `${activeCategory} Services` : 'Recommended For You'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link key={service._id} to={`/services/${service._id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-56 overflow-hidden">
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
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">{service.description}</p>
                <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Starts From</p>
                    <span className="text-2xl font-black text-gray-900">${service.price}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-md text-green-700 font-bold">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {services.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500">We couldn't find any services matching your search. Try another category!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
