import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Plus, Trash2, Scissors, X, Clock } from 'lucide-react';

const AdminServices = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: ''
  });

  useEffect(() => {
    if (!user || role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  useEffect(() => {
    if (user && role === 'ADMIN') {
      fetchServices();
    }
  }, [user, role]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await servicesAPI.getServices();
      setServices(res.services || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await servicesAPI.createService(formData);
      setFormData({ name: '', description: '', price: '', duration: '', image: '' });
      setShowAddForm(false);
      fetchServices(); 
      alert("Service added successfully!");
    } catch (err) {
      // Reverted to your original simple alert style
      alert("Failed to add service"); 
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await servicesAPI.deleteService(id);
        fetchServices();
        alert("Service deleted successfully!");
      } catch (err) {
        alert("Failed to delete service");
      }
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-screen text-[#FF2D7D] font-bold">Loading...</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Scissors className="text-[#FF2D7D]" size={28} />
              <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
            </div>
            <p className="text-gray-500 font-medium">Define and price your beauty offerings</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search services..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="bg-[#FF2D7D] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center shadow-md hover:bg-pink-600 transition-all">
                <Plus size={18} className="mr-2" /> Add New Service
              </button>
            )}
          </div>
        </header>

        {showAddForm && (
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-pink-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">New Service Details</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-pink-500"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Service Name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price (Rs.)" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
              <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duration (min)" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
              <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL (Pinterest/Google)" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="md:col-span-2 w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" rows="2"></textarea>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
                <button type="submit" className="bg-[#FF2D7D] text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition-all">Save Service</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Service</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase text-right">Price</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase text-center">Duration</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-5 flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center mr-4 overflow-hidden border border-pink-100">
                      {service.image ? <img src={service.image} className="w-full h-full object-cover" alt="" /> : <Scissors size={18} className="text-[#FF2D7D]" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{service.name}</p>
                      <p className="text-[11px] text-gray-400">{service.description || 'No description'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-[#FF2D7D]">Rs. {service.price}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg"><Clock size={12} className="mr-1" /> {service.duration} min</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => handleDelete(service.id, service.name)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminServices;