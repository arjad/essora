import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, LogOut, ChevronRight, Edit2, Check, X,
  MapPin, Calendar, CreditCard, Truck
} from 'lucide-react';

const TAB_INFO = 'info';
const TAB_ORDERS = 'orders';

function Avatar({ name }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ES';
  return (
    <div className="w-14 h-14 shrink-0 rounded-full bg-blue-950 flex items-center justify-center text-white font-serif text-xl shadow-lg shadow-blue-950/30 select-none">
      {initials}
    </div>
  );
}

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname === '/orders' ? TAB_ORDERS : TAB_INFO;

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', address: '', city: '', state: '', country: ''
  });

  React.useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
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
    } catch { /* silently redirect */ } finally { setLoading(false); }
  };

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user/${userId}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { /* noop */ }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/updatedetails`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) { setUser(data.data); setIsEditing(false); }
      else alert(data.error || 'Update failed');
    } catch { alert('Network error'); }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-950"></div>
      </div>
    );
  }

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || user.name || ''}`.trim() || 'Essora Member';

  const statusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'cancelled') return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-blue-50 text-blue-700 border-blue-100';
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Top Identity Strip */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 mb-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Avatar name={fullName} />
            <div>
              <p className="text-blue-950 font-serif text-xl leading-tight">{fullName}</p>
              <p className="text-slate-400 text-sm font-light mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: TAB_INFO, label: 'Profile', icon: User, path: '/profile' },
            { id: TAB_ORDERS, label: 'My Orders', icon: Package, path: '/orders' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20'
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200 hover:text-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          {activeTab === TAB_INFO && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                <div>
                  <h2 className="text-blue-950 font-serif text-xl">Personal Details</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Manage your shipping and contact information</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-950 hover:text-amber-600 transition-colors"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                )}
              </div>

              <div className="px-8 py-8">
                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { label: 'First Name', val: user.firstName || user.name?.split(' ')[0] },
                      { label: 'Last Name', val: user.lastName || user.name?.split(' ').slice(1).join(' ') },
                      { label: 'Email', val: user.email },
                      { label: 'Phone', val: user.phone || '—' },
                      { label: 'City', val: user.city || '—' },
                      { label: 'State', val: user.state || '—' },
                      { label: 'Country', val: user.country || '—' },
                      { label: 'Address', val: user.address || '—' },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">{label}</p>
                        <p className="text-slate-800 font-medium text-sm">{val}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {['firstName', 'lastName', 'email', 'phone', 'city', 'state', 'country'].map(field => (
                        <div key={field}>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
                            {field.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <input
                            type={field === 'email' ? 'email' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="w-full bg-slate-50/60 border border-slate-200 px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-950 transition-colors"
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Shipping Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="w-full bg-slate-50/60 border border-slate-200 px-4 py-3 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-950 transition-colors resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex items-center gap-2 bg-blue-950 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-900 transition-colors">
                        <Check size={14} /> Save
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-2 border border-slate-200 text-slate-500 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === TAB_ORDERS && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Panel Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-8 py-6 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-blue-950 font-serif text-xl">Order History</h2>
                    <p className="text-slate-400 text-xs mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                  </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-24 text-center">
                  <Package size={40} className="text-slate-200 mb-4" />
                  <p className="text-slate-400 font-light text-sm">You haven't placed any orders yet.</p>
                  <Link to="/collection" className="mt-6 text-xs font-bold uppercase tracking-widest text-blue-950 hover:text-amber-600 transition-colors">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link
                        to={`/order/${order._id}`}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group block overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-950/5 flex items-center justify-center shrink-0">
                              <Package size={16} className="text-blue-950" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-slate-400 text-[11px] mt-0.5">
                                {new Date(order.orderedAt || order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${statusColor(order.status)}`}>
                              {order.status || 'Pending'}
                            </span>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-950 transition-colors hidden sm:block" />
                          </div>
                        </div>

                        {/* Product List */}
                        <div className="px-6 py-4 space-y-3">
                          {order.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                {item.image
                                  ? <img src={item.image} className="w-full h-full object-contain p-1" alt={item.name} />
                                  : <span className="text-[10px] text-slate-300 font-bold">ES</span>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-blue-950 font-serif text-sm leading-tight truncate">{item.name}</p>
                                <p className="text-slate-400 text-[11px] mt-0.5">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-blue-950 font-bold text-sm shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-blue-950 font-bold text-base font-serif">Rs. {order.totalAmount?.toLocaleString()}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
