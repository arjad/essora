import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CreditCard, Package, MessageCircle, XCircle, Eye } from 'lucide-react';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        console.error('Order fetch error:', data.error);
      }
    } catch (err) {
      console.error('Network error while fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Your order has been cancelled.');
        setOrder(data.data);
      } else {
        alert(data.error || 'Cancellation failed.');
      }
    } catch (err) {
      alert('Could not cancel order. Please check your connection.');
    }
  };

  const handleWhatsAppPriority = () => {
    if (!order) return;
    const phoneNumber = "923703843482"; // Your WhatsApp Number
    const message = `Assalam o Alaikum Essora! I would like to increase the priority for my Order #${order._id.slice(-6).toUpperCase()}. 

Order Details:
- Items: ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
- Total: Rs. ${order.totalAmount.toLocaleString()}

Please let me know the next steps. Thank you!`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-20 text-gray-300 italic font-serif">Loading order details...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center p-20 text-gray-300 italic font-serif">Order not found.</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-950 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </button>

        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-950 px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-2">Order Specifics</p>
                <h1 className="text-3xl font-serif">Order #{order._id.slice(-6).toUpperCase()}</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Cancel Button - Only show if eligible */}
                {!['shipped', 'out for delivery', 'delivered', 'cancelled'].includes(order.status) && (
                    <button 
                        onClick={handleCancelOrder}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-sm transition-all"
                    >
                        <XCircle size={14} />
                        Cancel Order
                    </button>
                )}
                <span className={`text-[10px] font-black px-4 py-2 rounded-sm uppercase tracking-widest ${order.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-white text-blue-950'}`}>
                  {order.status || 'Processing'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Status & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-100 pb-12">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-blue-950">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Order Placed</p>
                  <p className="text-blue-950 font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-blue-950">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Estimated Delivery</p>
                  <p className="text-blue-950 font-medium">
                    {order.estimatedDeliveryDate 
                      ? new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Calculating...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-8 border-b border-slate-50 pb-4">Purchased Items</h2>
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-20 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center p-2">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <span className="text-[8px] text-slate-300">ES</span>}
                      </div>
                      <div>
                        <h3 className="text-blue-950 font-serif text-lg">{item.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-blue-950 font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-950">
                  <MapPin size={16} />
                  <h3 className="text-[10px] uppercase tracking-widest font-black">Shipping Destination</h3>
                </div>
                <div className="text-slate-600 space-y-1 font-light leading-relaxed">
                  <p className="font-bold text-blue-950">
                    {order.user?.firstName || order.user?.name?.split(' ')[0]} {order.user?.lastName || order.user?.name?.split(' ').slice(1).join(' ')}
                  </p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.state}</p>
                  <p>{order.country}</p>
                  <p className="pt-2 italic text-sm">{order.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-950">
                  <CreditCard size={16} />
                  <h3 className="text-[10px] uppercase tracking-widest font-black">Payment Summary</h3>
                </div>
                <div className="bg-slate-50 p-6 rounded-sm space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 mb-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  {order.paymentScreenshot && (
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 mb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Payment Proof</span>
                      <a 
                        href={order.paymentScreenshot} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4"
                      >
                        View Proof
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Subtotal</span>
                    <span className="text-blue-950 font-medium">Rs. {(order.totalAmount - (order.deliveryCharges || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Delivery</span>
                    <span className="text-blue-950 font-medium">Rs. {order.deliveryCharges || 0}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-950">Grand Total</span>
                    <span className="text-xl font-serif font-black text-blue-950">Rs. {order.totalAmount.toLocaleString()}</span>
                  </div>
                  {order.paymentScreenshot && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 italic">Payment Verification Proof</p>
                      <div className="group relative w-full aspect-[3/4] max-w-[200px] bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <img 
                          src={order.paymentScreenshot} 
                          alt="Payment Proof" 
                          className="w-full h-full object-contain bg-slate-100"
                        />
                        <a 
                          href={order.paymentScreenshot} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-blue-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={20} className="text-white mb-2" />
                          <span className="text-[10px] text-white font-bold uppercase tracking-widest px-3 py-1 border border-white/40 rounded-sm">View Full Screenshot</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-8 border-t border-slate-100">
                <div className="bg-green-50/50 border border-green-100 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h4 className="text-green-800 font-serif text-xl mb-2">Want faster delivery?</h4>
                        <p className="text-green-700/70 text-sm font-light">Message us on WhatsApp with your Order ID and we'll prioritize your shipment immediately.</p>
                    </div>
                    <button 
                        onClick={handleWhatsAppPriority}
                        className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                    >
                        <MessageCircle size={18} />
                        Priority via WhatsApp
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
