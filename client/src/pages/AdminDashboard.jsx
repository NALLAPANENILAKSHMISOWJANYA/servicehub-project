import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, PlusCircle, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // New Service Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cleaning');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, servicesRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/services')
        ]);
        setUsers(usersRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/services', {
        title,
        description,
        category,
        price: Number(price),
        image
      });
      setServices([...services, data]);
      toast.success('Service created successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setImage('');
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-2xl shadow-lg p-8 mb-8 text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-red-100 mt-2">Manage all system users and services</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 flex items-center justify-center rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <Users className="mr-2" /> All Users & Logins
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-4 flex items-center justify-center rounded-xl font-bold transition-all ${activeTab === 'services' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <LayoutGrid className="mr-2" /> Services & Catalog
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">System Users</h2>
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm font-bold">{users.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 font-medium">Name</th>
                  <th className="py-4 px-6 font-medium">Contact</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{u.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div>{u.phone}</div>
                      <div className="text-gray-400">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' :
                        u.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><PlusCircle className="mr-2" /> Add New Service</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="e.g., Deep House Cleaning" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500">
                    <option value="Cleaning">Cleaning</option>
                    <option value="Repair">Repair</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Salon">Salon</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="49" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500" rows="3" placeholder="Describe the service..."></textarea>
              </div>
              <button type="submit" className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors">
                Create Service
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <img src={service.image} alt={service.title} className="w-full h-40 object-cover" />
                <div className="p-4 flex-1">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded mb-2 inline-block">{service.category}</span>
                  <h3 className="font-bold text-gray-900">{service.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{service.description}</p>
                </div>
                <div className="p-4 border-t border-gray-50 font-black text-gray-900">
                  ${service.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
