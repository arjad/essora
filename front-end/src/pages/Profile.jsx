import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname === '/orders' ? 'orders' : 'info';
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    address: '',
    city: '',
    state: '',
    country: ''
  });

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
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          city: data.data.city || '',
          state: data.data.state || '',
          country: data.data.country || ''
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


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-gray-300 italic font-serif">Loading your profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-4 uppercase">Account Dashboard</h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto">Manage your personal information and track your fragrance collection.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 bg-white p-8 md:p-12 shadow-sm rounded-sm">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-4">
            <button 
              onClick={() => navigate('/profile')}
              className={`w-full text-left px-6 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50 border border-transparent'}`}
            >
              Profile Info
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className={`w-full text-left px-6 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50 border border-transparent'}`}
            >
              My Orders
            </button>
            
            <div className="pt-8 border-t border-slate-100">
                <button 
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="w-full text-left px-6 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                    Sign Out
                </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="min-h-[400px]">
              
              {activeTab === 'info' && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-serif text-blue-950 mb-8">Personal Details</h2>
                  {!isEditing ? (
                    <div className="space-y-8 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">First Name</label>
                          <p className="text-base text-slate-900 font-medium">{user.firstName || user.name?.split(' ')[0]}</p>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Last Name</label>
                          <p className="text-base text-slate-900 font-medium">{user.lastName || user.name?.split(' ').slice(1).join(' ')}</p>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Email Address</label>
                          <p className="text-base text-slate-900 font-medium">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phone Number</label>
                          <p className="text-base text-slate-900 font-medium">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">City</label>
                          <p className="text-base text-slate-900 font-medium">{user.city || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">State</label>
                          <p className="text-base text-slate-900 font-medium">{user.state || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Country</label>
                          <p className="text-base text-slate-900 font-medium">{user.country || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Shipping Address</label>
                        <p className="text-base text-slate-900 font-medium leading-relaxed">{user.address || 'Not provided'}</p>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-950 text-white px-10 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-900 transition-colors"
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Shipping Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="4"
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 focus:outline-none focus:border-blue-950 transition-colors resize-none"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="bg-blue-950 text-white px-10 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-900 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="border border-slate-200 text-slate-500 px-10 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-serif text-blue-950 mb-8">Order History</h2>
                  <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-sm">
                            <p className="text-slate-400 text-sm font-light">You haven't placed any orders yet.</p>
                        </div>
                    ) : orders.map(order => (
                        <Link to={`/order/${order._id}`} key={order._id} className="block border border-slate-100 p-8 rounded-sm flex flex-col md:flex-row md:items-start justify-between gap-8 hover:bg-slate-50 transition-colors group">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-24 h-32 bg-slate-100 rounded-sm flex items-center justify-center p-2 text-[10px] text-slate-400 overflow-hidden shadow-inner">
                                    {order.items[0]?.image ? <img src={order.items[0].image} className="w-full h-full object-cover" alt="order" /> : 'ES'}
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Order # {order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-xs text-slate-500 font-medium">{new Date(order.orderedAt || order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase tracking-widest text-blue-950 font-black">Items:</p>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <h3 className="text-blue-950 font-serif text-base">{item.name}</h3>
                                                    <span className="text-[10px] font-bold bg-blue-950 text-white px-2 py-0.5 rounded-full tracking-tighter">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {order.estimatedDeliveryDate && (
                                        <div className="flex items-center gap-2 text-[10px] text-blue-950/60 font-bold uppercase tracking-widest bg-blue-50/50 px-3 py-1 rounded-sm border border-blue-100/50 w-fit">
                                            <span className="opacity-60 text-black">Arrival:</span>
                                            <span className="text-blue-950 underline underline-offset-2 tracking-tight">{new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-10 md:gap-8 min-w-[150px] pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Order Status</p>
                                    <div className="flex flex-col items-end gap-2 text-right">
                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-sm uppercase tracking-widest border w-full text-center ${order.status === 'cancelled' ? 'bg-red-50 text-red-500 border-red-100' : (order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-950 text-white border-blue-950 shadow-md shadow-blue-950/10')}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">Payment:</span>
                                            <span className={`text-[9px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {order.paymentStatus || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total Amount</p>
                                    <p className="text-blue-950 font-black text-2xl">Rs. {order.totalAmount?.toLocaleString() || '0'}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
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

