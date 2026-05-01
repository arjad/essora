import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CreditCard, Package, MessageCircle, XCircle, Eye } from 'lucide-react';
import PageHeading from '../components/PageHeading';

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
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Expanded Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-100 pb-10 px-4 sm:px-8">
          <div className="flex flex-col">
          <PageHeading 
            title={`Order #${order._id.slice(-6).toUpperCase()}`}
            align="left"
            className="!mb-0"
          />
          </div>
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-950 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Back to My Orders
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20 items-start px-4 sm:px-8">
          
          {/* Left Side: Order Information & Items (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Status & Timing Bar */}
            <div className="flex flex-wrap items-center gap-8 bg-blue-950 px-8 py-8 text-white rounded-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Control Status</span>
                  <span className={`text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm flex items-center gap-2 ${order.status === 'cancelled' ? 'bg-red-500' : 'bg-white text-blue-950'}`}>
                    <Package size={14} />
                    {order.status || 'Processing'}
                  </span>
                </div>
                <div className="hidden sm:block h-10 w-px bg-white/10" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-white/50">Placing Date</span>
                  <span className="text-sm font-serif">{new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="hidden sm:block h-10 w-px bg-white/10" />
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-white/50">Estimated Logistics</span>
                   <span className="text-sm font-serif italic text-emerald-400">
                      {order.estimatedDeliveryDate 
                        ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
                        : 'Awaiting Schedule'}
                   </span>
                </div>
            </div>

            {/* Items Visualization */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-950">Manifest of Goods</h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.items.length} Unique Selections</span>
              </div>
              <div className="space-y-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-32 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center p-3 relative overflow-hidden transition-all group-hover:shadow-md">
                        {item.image ? (
                          <img src={item.image} className="w-full h-full object-contain relative z-10" />
                        ) : (
                          <span className="text-xs text-slate-200 font-serif">ESSORA</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-transparent opacity-50" />
                      </div>
                      <div>
                        <h3 className="text-blue-950 font-serif text-2xl mb-1">{item.name}</h3>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.2em] mb-3">Eau De Parfum</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-slate-100 rounded-sm text-slate-600">QTY: {item.quantity}</span>
                           <span className="px-2 py-0.5 bg-slate-100 rounded-sm text-slate-600">UNIT: Rs. {item.price.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-blue-950 font-serif text-xl">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Message */}
            <div className="bg-green-50/30 border border-green-100/50 p-10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-md">
                    <h4 className="text-green-900 font-serif text-2xl mb-2 italic">Priority Concierge</h4>
                    <p className="text-green-800/60 text-sm leading-relaxed">For expedited logistics or personalized assistance with this order, please engage our team on WhatsApp.</p>
                </div>
                <button 
                    onClick={handleWhatsAppPriority}
                    className="flex items-center gap-3 bg-blue-950 text-white px-10 py-5 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-900 transition-all shadow-2xl shadow-blue-950/20 active:scale-95 whitespace-nowrap"
                >
                    <MessageCircle size={20} />
                    Instant Priority
                </button>
            </div>
          </div>

          {/* Right Side: The Receipt/Summary Card (Sticky) */}
          <div className="lg:sticky lg:top-36 space-y-8">
            
            {/* Receipt Summary */}
            <div className="bg-white border border-neutral-100 shadow-2xl shadow-slate-200/50 rounded-sm overflow-hidden flex flex-col">
               <div className="bg-slate-50 px-8 py-6 border-b border-neutral-100 flex items-center gap-3">
                  <CreditCard size={18} className="text-blue-950 opacity-40" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950">Financial Receipt</h3>
               </div>
               
               <div className="p-8 space-y-6">
                  {/* Totals Section */}
                  <div className="space-y-4 pb-6 border-b border-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-slate-400">Transaction Status</span>
                       <span className={`px-3 py-1 rounded-sm ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {order.paymentStatus || 'Awaiting Verification'}
                       </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-400 uppercase tracking-widest font-bold">Base Value</span>
                       <span className="text-blue-950 font-serif">Rs. {(order.totalAmount - (order.deliveryCharges || 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-400 uppercase tracking-widest font-bold">Logistics</span>
                       <span className="text-blue-950 font-serif">Rs. {order.deliveryCharges || 0}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-950">Grand Total</span>
                     <span className="text-3xl font-serif font-black text-blue-950">Rs. {order.totalAmount.toLocaleString()}</span>
                  </div>

                  {/* Payment Proof Visualization */}
                  {order.paymentScreenshot && (
                    <div className="pt-6 border-t border-slate-100 group">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Verification Ledger</p>
                      <div className="relative w-full aspect-[4/5] bg-slate-50 border border-slate-200 rounded-sm overflow-hidden flex items-center justify-center">
                        <img 
                          src={order.paymentScreenshot} 
                          alt="Ledger Proof" 
                          className="w-full h-full object-cover opacity-80"
                        />
                        <a 
                          href={order.paymentScreenshot} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-blue-950/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={24} className="text-white mb-3" />
                          <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em] px-4 py-2 border border-white/20 rounded-sm">Inspect Full Proof</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Shipping Brief */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                       <MapPin size={14} className="text-blue-950 opacity-40" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950">Destination Brief</span>
                    </div>
                    <div className="text-[11px] leading-relaxed text-slate-500 font-light space-y-1">
                       <p className="font-bold text-blue-950 text-sm">{order.user?.name || `${order.user?.firstName} ${order.user?.lastName}`}</p>
                       <p>{order.address}</p>
                       <p>{order.city}, {order.state} {order.zipCode}</p>
                       <p className="uppercase tracking-widest pt-2">{order.country}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Permanent Cancellation - Moved to end of sidebar */}
            {!['shipped', 'out for delivery', 'delivered', 'cancelled'].includes(order.status) && (
              <div className="p-6 bg-red-50/20 border border-red-100 rounded-sm">
                <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-4 opacity-60">Cancellation Rights</p>
                <button 
                    onClick={handleCancelOrder}
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-6 py-4 rounded-sm transition-all bg-white"
                >
                    Retract Order
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
