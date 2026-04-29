import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Trash2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState({ 
    phone: '', 
    address: '',
    city: '',
    state: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleProceedToCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onClose();
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const user = data.data;
        // Check if ANY required shipping detail is missing
        if (!user.phone || !user.address || !user.city || !user.state || !user.country) {
          setUserDetails({ 
            phone: user.phone || '', 
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || ''
          });
          setShowDetailsForm(true);
        } else {
          // All details present, proceed with existing user data
          placeOrder(token, user._id, user);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const placeOrder = async (token, userId, shippingInfo) => {
    setIsLoading(true);
    console.log('[Checkout] Placing order for user:', userId);
    
    try {
      const orderData = {
        user: userId,
        items: cartItems.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: parseInt(item.price.replace(/[^0-9]/g, ''))
        })),
        totalAmount: cartTotal + 349,
        deliveryCharges: 349,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country
      };

      console.log('[Checkout] Sending payload:', orderData);

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('[Checkout] Server response:', data);

      if (data.success) {
        console.log('[Checkout] Order created successfully. Clearing cart...');
        setOrderSuccess(true);
        clearCart();
        setTimeout(() => {
          setOrderSuccess(false);
          setShowDetailsForm(false);
          onClose();
          navigate('/profile');
        }, 3000);
      } else {
        alert('Order failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('[Checkout] Fatal error:', err);
      alert('Could not place order. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDetailsAndOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsLoading(true);
    
    try {
      // 1. Update user details first
      const updateRes = await fetch('http://localhost:5001/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userDetails)
      });
      
      const updateData = await updateRes.json();
      if (updateData.success) {
        // 2. Then place the order using the freshly updated user data
        await placeOrder(token, updateData.data._id, updateData.data);
      }
    } catch (err) {
      console.error('Update and checkout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-950" />
            <h2 className="text-lg font-serif font-bold text-blue-950 uppercase tracking-widest">
              {orderSuccess ? 'Success' : showDetailsForm ? 'Details' : 'Shopping Cart'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-950"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success State */}
        {orderSuccess ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-serif text-blue-950 mb-3">Order Placed!</h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Your request for luxury has been received. You will be redirected to your order history shortly.
            </p>
          </div>
        ) : showDetailsForm ? (
          /* Profile Details Form */
          <div className="flex-grow overflow-y-auto px-8 py-10 animate-fadeIn">
            <h3 className="text-xl font-serif text-blue-950 mb-2 italic">Almost There...</h3>
            <p className="text-sm text-slate-500 mb-8 font-light">Please provide your delivery information to complete the order.</p>
            
            <form onSubmit={handleUpdateDetailsAndOrder} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-sm text-blue-950 text-sm focus:outline-none focus:border-blue-950 transition-colors"
                  placeholder="e.g. +92 370 3843482"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">City</label>
                  <input
                    type="text"
                    value={userDetails.city}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-sm text-blue-950 text-sm focus:outline-none focus:border-blue-950 transition-colors"
                    placeholder="Lahore"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">State</label>
                  <input
                    type="text"
                    value={userDetails.state}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-sm text-blue-950 text-sm focus:outline-none focus:border-blue-950 transition-colors"
                    placeholder="Punjab"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Country</label>
                <input
                  type="text"
                  value={userDetails.country}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-sm text-blue-950 text-sm focus:outline-none focus:border-blue-950 transition-colors"
                  placeholder="Pakistan"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Delivery Address</label>
                <textarea
                  value={userDetails.address}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, address: e.target.value }))}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-sm text-blue-950 text-sm focus:outline-none focus:border-blue-950 transition-colors resize-none"
                  placeholder="Street, City, Country"
                  required
                />
              </div>
              
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-950 text-white py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-900 transition-all shadow-lg hover:shadow-blue-950/20 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Confirm & Place Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetailsForm(false)}
                  className="w-full mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-blue-950 transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Normal Cart List */
          <>
            <div className="flex-grow overflow-y-auto px-6 py-4">
              {cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-slate-50 rounded-sm overflow-hidden flex-shrink-0 border border-slate-100 italic flex items-center justify-center text-[10px] text-slate-300">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : 'Fragrance'}
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-serif font-bold text-blue-950">{item.name}</h3>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Eau De Parfum</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-blue-950">{item.price}</p>
                          <div className="flex items-center border border-slate-200 rounded-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2 py-1 text-slate-400 hover:text-blue-950 transition-colors"
                            >-</button>
                            <span className="px-3 py-1 text-xs font-bold text-blue-950">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2 py-1 text-slate-400 hover:text-blue-950 transition-colors"
                            >+</button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-blue-950 font-serif font-bold italic mb-2">Cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-[200px]">Experience luxury with our curated collection.</p>
                  <button 
                    onClick={() => {
                      onClose();
                      navigate('/collection');
                    }}
                    className="mt-6 text-xs font-bold uppercase tracking-widest text-blue-950 border-b-2 border-blue-950 pb-1"
                  >
                    Go to Collection
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-6 py-6 border-t border-slate-100 bg-slate-50 space-y-4">
                {/* Coupon Code */}
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="ENTER COUPON CODE" 
                    className="w-full bg-white border border-slate-200 px-4 py-3 rounded-sm text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-blue-950 transition-colors uppercase"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-950 uppercase tracking-widest hover:text-blue-700 transition-colors">
                    Apply
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Subtotal</span>
                    <span className="text-sm font-bold">Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Tax (0%)</span>
                    <span className="text-sm font-bold">Rs. 0</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Delivery Charges</span>
                    <span className="text-sm font-bold">Rs. 349</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-[11px] uppercase tracking-widest text-blue-950 font-black underline underline-offset-4">Estimated Total</span>
                    <span className="text-xl font-serif font-black text-blue-950">Rs. {(cartTotal + 349).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  disabled={isLoading}
                  className="w-full bg-blue-950 text-white py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-900 transition-all shadow-lg hover:shadow-blue-950/20 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

