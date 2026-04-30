import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Package, LogOut, CheckCircle, Clock, Layout, DollarSign, Pencil, Trash2, Plus, Minus, X, Shield, Star, Tag, Search, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'overview';

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [creating, setCreating] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) checkAuth(token);
    else window.location.href = '/login';
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
    setSearchTerm('');
  }, [activeTab, isAuthenticated]);

  const checkAuth = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data.admin) setIsAuthenticated(true);
      else { localStorage.removeItem('token'); window.location.href = '/login'; }
    } catch (err) { window.location.href = '/login'; }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      let endpoint = '';
      if (activeTab === 'users') endpoint = 'http://127.0.0.1:5001/api/auth/users';
      if (activeTab === 'orders') endpoint = 'http://127.0.0.1:5001/api/orders';
      if (activeTab === 'products') endpoint = 'http://127.0.0.1:5001/api/products';
      if (activeTab === 'overview') endpoint = 'http://127.0.0.1:5001/api/dashboard/stats';

      if (endpoint) {
        const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) {
          if (activeTab === 'users') setUsers(json.data);
          if (activeTab === 'orders') setOrders(json.data);
          if (activeTab === 'products') setProducts(json.data);
          if (activeTab === 'overview') setStats(json.data);
        }
      }

      if (activeTab === 'orders' || activeTab === 'overview') {
        const [uRes, pRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/api/auth/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://127.0.0.1:5001/api/products', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const uData = await uRes.json();
        const pData = await pRes.json();
        if (uData.success) setUsers(uData.data);
        if (pData.success) setProducts(pData.data);
      }
    } catch (err) { setError('Connection error'); } finally { setLoading(false); }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setCreating(true);
    const token = localStorage.getItem('token');
    let endpoint = '';
    let method = 'POST';
    
    // Ensure totalAmount is calculated
    const itemsToSave = activeTab === 'orders' ? orderItems : (formData.items || []);
    const itemsTotal = itemsToSave.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const finalTotal = itemsTotal + Number(formData.deliveryCharges || 0);

    let payload = { 
      ...formData, 
      items: itemsToSave, 
      totalAmount: finalTotal 
    };

    if (activeTab === 'users') {
      endpoint = editMode ? `http://127.0.0.1:5001/api/auth/user/${selectedItem._id}` : 'http://127.0.0.1:5001/api/auth/register';
      method = editMode ? 'PUT' : 'POST';
    } else if (activeTab === 'products') {
      endpoint = editMode ? `http://127.0.0.1:5001/api/products/${selectedItem._id}` : 'http://127.0.0.1:5001/api/products';
      method = editMode ? 'PUT' : 'POST';
    } else if (activeTab === 'orders') {
      endpoint = editMode ? `http://127.0.0.1:5001/api/orders/${selectedItem._id}` : 'http://127.0.0.1:5001/api/orders';
      method = editMode ? 'PUT' : 'POST';
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(false); setEditMode(false); setSelectedItem(null); setFormData({}); setOrderItems([]); fetchData();
      } else alert(data.error || 'Operation failed');
    } catch (err) { alert('Network error'); } finally { setCreating(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    setProcessingId(id);
    const token = localStorage.getItem('token');
    let endpoint = '';
    if (type === 'user') endpoint = `http://127.0.0.1:5001/api/auth/user/${id}`;
    if (type === 'product') endpoint = `http://127.0.0.1:5001/api/products/${id}`;
    if (type === 'order') endpoint = `http://127.0.0.1:5001/api/orders/${id}`;
    try {
      const response = await fetch(endpoint, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if ((await response.json()).success) fetchData();
    } catch (err) { alert('Delete failed'); } finally { setProcessingId(null); }
  };

  const addOrderItem = (productId) => {
    if (!productId) return;
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const sourceArr = [...orderItems];
    const exists = sourceArr.find(item => (item.product === product._id || item.id === product._id || item._id === product._id));
    
    let updated;
    if (exists) {
      updated = sourceArr.map(item => (item.product === product._id || item.id === product._id || item._id === product._id) ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updated = [...sourceArr, { product: product._id, name: product.name, price: product.price, quantity: 1, image: product.image_url }];
    }
    
    setOrderItems(updated);
  };

  const filteredUsers = users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredOrders = orders.filter(o => (o._id && o._id.toString().includes(searchTerm)) || (o.user && (`${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))));

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="w-64 bg-primary text-white flex flex-col p-6 shadow-2xl fixed h-screen">
        <div className="mb-12">
          <h1 className="text-2xl text-white lowercase italic font-black">essora</h1>
          <p className="text-[8px] uppercase tracking-[0.4em] opacity-50 font-bold">management admin</p>
        </div>
        <nav className="flex-grow space-y-2">
          <Link to="/admin/overview" className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-primary' : 'hover:bg-white/10 text-white'}`}><Layout size={14} /> Overview</Link>
          <Link to="/admin/users" className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-primary' : 'hover:bg-white/10 text-white'}`}><Users size={14} /> Users</Link>
          <Link to="/admin/orders" className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-primary' : 'hover:bg-white/10 text-white'}`}><ShoppingBag size={14} /> Orders</Link>
          <Link to="/admin/products" className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-primary' : 'hover:bg-white/10 text-white'}`}><Package size={14} /> Products</Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="mt-auto flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all text-red-100"><LogOut size={14} /> Logout</button>
      </div>

      <div className="flex-grow ml-64 px-24 py-16 overflow-y-auto min-h-screen text-primary">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl text-primary italic capitalize font-black tracking-tighter">{activeTab}</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-black mt-2 opacity-50">Enterprise Resource Planning</p>
          </div>
          <div className="flex gap-4">
            {activeTab !== 'overview' && (
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                 <input type="text" placeholder="Quick Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase shadow-sm focus:ring-4 focus:ring-primary/5 transition-all w-64" />
              </div>
            )}
            <button onClick={fetchData} className="p-3 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-primary rounded-full transition-all">{loading ? <div className="animate-spin"><Clock size={16} /></div> : <Clock size={16} />}</button>
            {activeTab !== 'overview' && (
              <button 
                onClick={() => { setEditMode(false); setSelectedItem(null); setFormData({ deliveryCharges: 0, paymentStatus: 'pending', status: 'pending' }); setOrderItems([]); setShowModal(true); }}
                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:shadow-2xl hover:scale-105 transition-all"
              >
                + New {activeTab?.slice(0, -1)}
              </button>
            )}
          </div>
        </div>

        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-3 gap-8 mb-12">
            {[ { label: 'Active Users', val: stats.totalUsers, icon: <Users size={20} />, bg: 'bg-blue-50', text: 'text-blue-600' }, { label: 'Success Orders', val: stats.totalOrders, icon: <ShoppingBag size={20} />, bg: 'bg-green-50', text: 'text-green-600' }, { label: 'Net Revenue', val: `Rs. ${Math.floor(stats.totalSales)}`, icon: <DollarSign size={20} />, bg: 'bg-amber-50', text: 'text-amber-600' } ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                 <div className={`w-12 h-12 ${card.bg} ${card.text} rounded-2xl flex items-center justify-center mb-6`}>{card.icon}</div>
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">{card.label}</h3>
                 <p className="text-5xl font-black italic tracking-tighter text-primary">{card.val || 0}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {activeTab === 'users' && ['User Identity', 'Location/Contact', 'Rights', 'Memo', 'Tools'].map(h => <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>)}
                {activeTab === 'products' && ['Product Details', 'Market SKU', 'In-Stock', 'Memo', 'Tools'].map(h => <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>)}
                {activeTab === 'orders' && ['Ref ID', 'End-User', 'Financials', 'Payment', 'Tools'].map(h => <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-50">
                    <td className="px-8 py-8"><div className="h-6 w-32 bg-gray-100 rounded-lg"></div></td>
                    <td className="px-8 py-8"><div className="h-6 w-24 bg-gray-100 rounded-lg"></div></td>
                    <td className="px-8 py-8"><div className="h-6 w-16 bg-gray-100 rounded-lg"></div></td>
                    <td className="px-8 py-8"><div className="h-6 w-40 bg-gray-100 rounded-lg"></div></td>
                    <td className="px-8 py-8 flex gap-3"><div className="w-4 h-4 bg-gray-100 rounded"></div><div className="w-4 h-4 bg-gray-100 rounded"></div></td>
                  </tr>
                ))
              ) : (
                <>
                  {activeTab === 'users' && filteredUsers.map(u => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                      <td className="px-8 py-8"><span className="text-sm font-black block">{u.firstName} {u.lastName}</span><span className="text-[10px] font-black text-gray-300 uppercase italic opacity-50">{u.email}</span></td>
                      <td className="px-8 py-8"><span className="text-[10px] font-black uppercase block">{u.city || 'UAE'}</span><span className="text-[10px] italic text-gray-300">{u.phone || 'No Phone'}</span></td>
                      <td className="px-8 py-8">{u.admin ? <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase italic tracking-widest">Administrator</span> : <span className="text-[8px] font-black uppercase text-gray-300">Customer</span>}</td>
                      <td className="px-8 py-8 text-[10px] text-gray-400 italic max-w-xs truncate">{u.description || '---'}</td>
                      <td className="px-8 py-8 flex gap-3 text-gray-300">
                        <button onClick={() => { setEditMode(true); setSelectedItem(u); setFormData(u); setShowModal(true); }} className="hover:text-primary transition-all"><Pencil size={16} /></button>
                        <button disabled={processingId === u._id} onClick={() => handleDelete('user', u._id)} className="hover:text-red-500 transition-all">
                          {processingId === u._id ? <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'products' && filteredProducts.map(p => (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                      <td className="px-8 py-8 flex items-center gap-4"><img src={p.image_url} className="w-12 h-12 rounded-2xl object-cover shadow-sm bg-gray-50" /><div><span className="text-sm font-black block">{p.name}</span><span className="text-[10px] font-black uppercase text-gray-300 italic">{p.category}</span></div></td>
                      <td className="px-8 py-8"><span className="text-[10px] font-black uppercase block">{p.brand}</span><span className="text-[10px] text-primary italic font-black opacity-30">{p.sku}</span></td>
                      <td className="px-8 py-8 font-black italic text-sm">{p.stock} Units</td>
                      <td className="px-8 py-8 text-[10px] text-gray-400 italic max-w-xs truncate">{p.description}</td>
                      <td className="px-8 py-8 flex gap-3 text-gray-300">
                        <button onClick={() => { setEditMode(true); setSelectedItem(p); setFormData(p); setShowModal(true); }} className="hover:text-primary transition-all"><Pencil size={16} /></button>
                        <button disabled={processingId === p._id} onClick={() => handleDelete('product', p._id)} className="hover:text-red-500 transition-all">
                          {processingId === p._id ? <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'orders' && filteredOrders.map(o => (
                    <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all text-primary font-bold">
                      <td className="px-8 py-8 text-xs italic tracking-tighter opacity-50 uppercase"># {o._id.toString().slice(-8)}</td>
                      <td className="px-8 py-8"><span className="text-sm font-black block">{o.user?.firstName} {o.user?.lastName}</span><span className="text-[10px] opacity-40 font-black uppercase italic">{o.user?.email}</span></td>
                      <td className="px-8 py-8">
                        <span className="text-sm font-black text-green-600 italic tracking-tighter block">Rs. {o.totalAmount}</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${o.status === 'cancelled' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{o.status}</span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm border ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {o.paymentStatus || 'Pending'}
                          </span>
                          {o.paymentScreenshot && (
                            <a href={o.paymentScreenshot} target="_blank" rel="noreferrer" className="text-[8px] text-blue-500 hover:underline flex items-center gap-1 font-black uppercase tracking-widest">
                              <FileText size={10} /> View Proof
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-8 flex gap-3 text-gray-300">
                        <button onClick={() => { setEditMode(true); setSelectedItem(o); setFormData(o); setOrderItems(o.items || []); setShowModal(true); }} className="hover:text-primary transition-all"><Pencil size={16} /></button>
                        <button disabled={processingId === o._id} onClick={() => handleDelete('order', o._id)} className="hover:text-red-500 transition-all">
                          {processingId === o._id ? <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && ((activeTab === 'users' && filteredUsers.length === 0) || (activeTab === 'products' && filteredProducts.length === 0) || (activeTab === 'orders' && filteredOrders.length === 0)) && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-gray-300 italic font-black uppercase tracking-widest text-[10px]">No records found in this dimension</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl p-12 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setShowModal(false); setEditMode(false); }} className="absolute top-10 right-10 text-gray-300 hover:text-primary transition-all group rounded-full border border-gray-200 p-2"><X size={18} className="group-hover:rotate-90 transition-all" /></button>
            <h2 className="text-2xl text-primary italic font-black uppercase tracking-tight mb-8">{editMode ? 'Synchronize' : 'Provision'} {activeTab?.slice(0, -1)}</h2>
            
            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-12 gap-8">
               {activeTab === 'users' && (
                 <div className="col-span-12 grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">First Name</label><input type="text" value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black" required /></div>
                          <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Last Name</label><input type="text" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black" required /></div>
                       </div>
                       <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Enterprise Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black shadow-inner" required /></div>
                       {!editMode && <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Initial Passphrase</label><input type="password" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black" required /></div>}
                       <div className="flex items-center justify-between bg-primary/5 p-4 rounded-3xl border border-primary/10">
                          <div className="flex items-center gap-4 text-primary font-black uppercase tracking-widest italic text-[8px]">Admin Privileges</div>
                          <input type="checkbox" checked={formData.admin || false} onChange={e => setFormData({...formData, admin: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-0 border-none" />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Internal Memo</label><textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-[2rem] px-6 py-5 text-xs font-black h-32 resize-none shadow-inner" placeholder="Log administrative context here..." /></div>
                       <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Geographic Tag</label><input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black" placeholder="City, Region" /></div>
                    </div>
                 </div>
               )}

               {activeTab === 'products' && (
                 <div className="col-span-12 grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Product Identity</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black" required /></div>
                        <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Manufacturer</label><input type="text" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black" /></div>
                       </div>
                       <div className="grid grid-cols-3 gap-4">
                        <div><label className="text-[8px] font-black uppercase text-gray-400 px-1 mb-2 block">Base (Rs.)</label><input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-[1.5rem] px-4 py-3 text-xs font-black" required /></div>
                        <div><label className="text-[8px] font-black uppercase text-gray-400 px-1 mb-2 block">Stock</label><input type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border-none rounded-[1.5rem] px-4 py-3 text-xs font-black" required /></div>
                        <div><label className="text-[8px] font-black uppercase text-gray-400 px-1 mb-2 block">Category</label><input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-[1.5rem] px-4 py-3 text-xs font-black uppercase" /></div>
                       </div>
                    </div>
                    <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block">Spec Description</label><textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-[2rem] px-6 py-6 text-xs font-black h-40 resize-none shadow-inner" required /></div>
                 </div>
               )}

               {activeTab === 'orders' && (
                 <>
                   <div className="col-span-12 md:col-span-7 space-y-6 pr-6 border-r border-gray-100">
                      <div><label className="text-[8px] font-black uppercase text-primary italic mb-3 block px-1 tracking-widest underline decoration-2 underline-offset-4">Phase 1. Targeted Selection</label>
                        <select value={formData.user?._id || formData.user || ''} onChange={(e) => setFormData({...formData, user: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black shadow-sm" required>
                          <option value="">-- Choose Customer Target --</option>
                          {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                        </select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[8px] font-black uppercase text-primary italic mb-3 block px-1 tracking-widest underline decoration-2 underline-offset-4">Phase 2. Modular Cart Configuration</label>
                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50">
                           <div className="mb-4">
                              <label className="text-[8px] font-black uppercase text-gray-400 mb-1 block">Add Product to Bundle</label>
                              <select 
                                onChange={(e) => { addOrderItem(e.target.value); e.target.value = ""; }} 
                                className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase shadow-sm"
                              >
                                 <option value="">-- Select Product --</option>
                                 {products.map(p => <option key={p._id} value={p._id}>{p.name} (Rs. {p.price})</option>)}
                              </select>
                           </div>
                           
                           <div className="space-y-2 border-t border-gray-200 pt-4 max-h-48 overflow-y-auto">
                              {orderItems.map((item, idx) => (
                                <div key={item.product || item.id || item._id || idx} className="flex items-center justify-between bg-primary text-white p-3 rounded-xl shadow-md">
                                   <div className="flex flex-col truncate w-32">
                                      <span className="text-[9px] font-black italic truncate">{item.name}</span>
                                      <span className="text-[8px] opacity-60 font-black">Rs. {Number(item.price)}/ea</span>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <button type="button" onClick={() => {
                                        const updated = orderItems.map((i, idx2) => idx === idx2 ? {...i, quantity: Math.max(1, i.quantity - 1)} : i);
                                        setOrderItems(updated);
                                      }} className="hover:bg-white/20 p-1 rounded-lg"><Minus size={10} /></button>
                                      <span className="text-[10px] font-black underline underline-offset-4">{item.quantity}</span>
                                      <button type="button" onClick={() => {
                                        const updated = orderItems.map((i, idx2) => idx === idx2 ? {...i, quantity: i.quantity + 1} : i);
                                        setOrderItems(updated);
                                      }} className="hover:bg-white/20 p-1 rounded-lg"><Plus size={10} /></button>
                                      <button type="button" onClick={() => {
                                        const updated = orderItems.filter((_, idx2) => idx !== idx2);
                                        setOrderItems(updated);
                                      }} className="text-red-300 hover:text-white transition-all ml-1"><X size={12} /></button>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="col-span-12 md:col-span-5 flex flex-col justify-between space-y-6">
                      <div className="space-y-6">
                        <div><label className="text-[8px] font-black uppercase text-gray-300 px-1 mb-2 block tracking-tighter">Critical Phase 3. Context Description</label><textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-xs font-black h-32 resize-none shadow-inner" placeholder="Inject contextual memoranda here..." /></div>
                        
                         <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div><label className="text-[8px] font-black uppercase text-gray-400 mb-1 block">Delivery (Rs.)</label><input type="number" value={formData.deliveryCharges || 0} onChange={(e) => setFormData({...formData, deliveryCharges: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs font-black shadow-sm" /></div>
                              <div><label className="text-[8px] font-black uppercase text-gray-400 mb-1 block">Logistics</label><select value={formData.status || 'pending'} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase shadow-sm"><option value="pending">Pending</option><option value="ready to ship">Ready</option><option value="shipped">Shipped</option><option value="out for delivery">Out</option><option value="delivered">Done</option><option value="cancelled">Cancelled</option></select></div>
                            </div>
                            <div>
                             <div>
                               <label className="text-[8px] font-black uppercase text-gray-400 mb-1 block px-1">Payment Status</label>
                               <div className="grid grid-cols-2 gap-2">
                                 <button type="button" onClick={() => setFormData({...formData, paymentStatus: 'pending'})} className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.paymentStatus === 'pending' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-amber-500 border-amber-100 hover:bg-amber-50'}`}>Pending</button>
                                 <button type="button" onClick={() => setFormData({...formData, paymentStatus: 'paid'})} className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.paymentStatus === 'paid' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-emerald-500 border-emerald-100 hover:bg-emerald-50'}`}>Paid</button>
                               </div>
                             </div>
                             {formData.paymentScreenshot && (
                               <div className="pt-2">
                                 <label className="text-[8px] font-black uppercase text-gray-400 mb-2 block px-1">Verification Proof</label>
                                 <a href={formData.paymentScreenshot} target="_blank" rel="noreferrer" className="block w-full h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-primary transition-all">
                                   <img src={formData.paymentScreenshot} className="w-full h-full object-contain" alt="Proof" />
                                 </a>
                               </div>
                             )}
                           </div>
                        </div>
                      </div>

                       <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group mt-4">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1 tracking-widest">Aggregated Grand Total</p>
                        <p className="text-3xl font-black italic tracking-tighter drop-shadow-lg leading-none">
                          Rs. { ( orderItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0) + Number(formData.deliveryCharges || 0) ) }
                        </p>
                       </div>
                    </div>
                  </>
                )}

               <div className="col-span-12">
                  <button disabled={creating} className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3">
                    {creating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Synchronizing...
                      </>
                    ) : (editMode ? 'Secure Final Update' : 'Finalize Master Entry')}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
