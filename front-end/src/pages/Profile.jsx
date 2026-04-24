import React, { useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || ''
        });
        fetchOrders(data.data._id);
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        setIsEditing(false);
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const [activeTab, setActiveTab] = useState('info');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-gray-300 italic font-serif">Loading your profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-12 tracking-tight">Account Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab('info')}
              className={`w-full text-left px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              Profile Info
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              My Orders
            </button>
            <button 
              onClick={() => setActiveTab('complaint')}
              className={`w-full text-left px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'complaint' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              Register Complaint
            </button>
            <button 
              onClick={() => setActiveTab('help')}
              className={`w-full text-left px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'help' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              Help & Support
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]">
              
              {activeTab === 'info' && (
                <div>
                  <h2 className="text-2xl font-serif text-primary mb-8 italic">Personal Information</h2>
                  {!isEditing ? (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Full Name</label>
                        <p className="text-lg font-medium text-primary">{user.name}</p>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Email Address</label>
                        <p className="text-lg font-medium text-primary">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Phone Number</label>
                        <p className="text-lg font-medium text-primary">{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Delivery Address</label>
                        <p className="text-lg font-medium text-primary leading-relaxed">{user.address || 'Not provided'}</p>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                          Edit Information
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Delivery Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="bg-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="text-gray-500 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-serif text-primary mb-8 italic">Your Orders</h2>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-gray-400 text-sm italic font-serif">You haven't placed any orders yet.</p>
                    ) : orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2 text-[10px] text-gray-400">
                            {order.items[0]?.image ? <img src={order.items[0].image} className="w-full h-full object-cover" alt="order" /> : 'Fragrance'}
                            </div>
                            <div>
                            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Order # {order._id.slice(-6).toUpperCase()}</p>
                            <h3 className="text-primary font-bold">{order.items[0]?.name || 'Essora Product'}</h3>
                            <p className="text-xs text-gray-500">{new Date(order.orderedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {order.status}
                        </span>
                        </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'complaint' && (
                <div>
                  <h2 className="text-2xl font-serif text-primary mb-4 italic">Submit a Complaint</h2>
                  <p className="text-sm text-gray-400 mb-8">Tell us what went wrong. Our team will review your case as soon as possible.</p>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Subject</label>
                      <input type="text" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-primary focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Delayed Delivery" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Describe Your Issue</label>
                      <textarea rows="5" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg text-primary focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Provide as much detail as possible..."></textarea>
                    </div>
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                      Submit Ticket
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'help' && (
                <div>
                  <h2 className="text-2xl font-serif text-primary mb-8 italic">Help & Support</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-primary transition-colors cursor-pointer">
                      <h3 className="font-bold text-primary mb-2">Shipping Information</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-pretty">Everything you need to know about delivery times and tracking.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-primary transition-colors cursor-pointer">
                      <h3 className="font-bold text-primary mb-2">Returns & Refunds</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-pretty">A simple guide on how to return items and get a refund.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-primary transition-colors cursor-pointer">
                      <h3 className="font-bold text-primary mb-2">Fragrance Guide</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-pretty">Need help choosing your next scent? We're here to help.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-100 hover:border-primary transition-colors cursor-pointer">
                      <h3 className="font-bold text-primary mb-2">Contact Concierge</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-pretty">Email us at concierge@essora.com for private help.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
