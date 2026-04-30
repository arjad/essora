import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, CreditCard, Ship, ShoppingBag, Upload, Copy, Check } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment Method, 3: Proof, 4: Success
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const [userDetails, setUserDetails] = useState({ 
    phone: '', 
    address: '',
    city: '',
    state: '',
    country: 'Pakistan'
  });

  const paymentOptions = [
    { 
        id: 'jazzcash', 
        name: 'JazzCash', 
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3yA1x3fW8k8n2f9f1y2f4f5f6f7f8f9f', // Placeholder logo
        color: '#ff0000',
        accountName: 'Essora Luxury',
        accountNumber: '0300 1234567'
    },
    { 
        id: 'easypaisa', 
        name: 'EasyPaisa', 
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3yA1x3fW8k8n2f9f1y2f4f5f6f7f8f9f', // Placeholder logo
        color: '#00cc00',
        accountName: 'Essora Luxury',
        accountNumber: '0312 3456789'
    },
    { 
        id: 'mashreq', 
        name: 'Mashreq Bank', 
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3yA1x3fW8k8n2f9f1y2f4f5f6f7f8f9f', // Placeholder logo
        color: '#ff9900',
        accountName: 'Essora Luxury PVT LTD',
        accountNumber: '12345678901234'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/collection');
      return;
    }

    // Fetch user details if they exist
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          const user = data.data;
          setUserDetails({
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || 'Pakistan'
          });
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUser();
  }, [navigate, cartItems.length, orderSuccess]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : 'guest';
    
    setScreenshot(file);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);
    formData.append('orderId', 'PRE-' + Date.now().toString().slice(-6)); 

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setScreenshotUrl(data.data);
      } else {
        alert('Upload failed: ' + (data.error || 'Check backend logs'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading screenshot. Please check the backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeOrder = async () => {
    if (!screenshotUrl) {
      alert('Please upload a payment screenshot to proceed.');
      return;
    }

    const token = localStorage.getItem('token');
    setIsLoading(true);
    
    try {
      // 1. Update user details first (optional but good for persistence)
      await fetch('http://localhost:5001/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userDetails)
      });

      // 2. Place order
      const orderData = {
        user: JSON.parse(atob(token.split('.')[1])).id,
        items: cartItems.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: parseInt(item.price.replace(/[^0-9]/g, '')),
          image: item.image
        })),
        totalAmount: cartTotal + 349,
        deliveryCharges: 349,
        phone: userDetails.phone,
        address: userDetails.address,
        city: userDetails.city,
        state: userDetails.state,
        country: userDetails.country,
        paymentScreenshot: screenshotUrl
      };

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.success) {
        setOrderSuccess(true);
        setStep(4);
        clearCart();
      } else {
        alert('Order failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Finalize error:', err);
      alert('Could not place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-serif text-blue-950 mb-4">Order Successfully Placed!</h2>
        <p className="text-slate-500 font-light max-w-md mx-auto mb-10 leading-relaxed">
          Thank you for choosing Essora. Your payment proof has been received and is being verified. 
          You will receive an update shortly.
        </p>
        <button 
          onClick={() => navigate('/profile')}
          className="bg-blue-950 text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.3em] hover:bg-blue-900 transition-all shadow-xl hover:shadow-blue-950/20"
        >
          View Order History
        </button>
      </div>
    );
  }

  const selectedPayment = paymentOptions.find(p => p.id === paymentMethod);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Steps */}
        <div className="flex-grow lg:w-2/3">
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-blue-950 uppercase tracking-widest mb-2">Checkout</h1>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className={step >= 1 ? 'text-blue-950' : ''}>Shipping</span>
              <span className="w-8 h-[1px] bg-slate-200"></span>
              <span className={step >= 2 ? 'text-blue-950' : ''}>Payment</span>
              <span className="w-8 h-[1px] bg-slate-200"></span>
              <span className={step >= 3 ? 'text-blue-950' : ''}>Confirmation</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-sm p-8 shadow-sm">
            {/* Step 1: Shipping Details */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-serif text-blue-950 mb-6 italic">Where should we deliver?</h2>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={userDetails.phone}
                        onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-blue-950 transition-colors"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={userDetails.city}
                        onChange={(e) => setUserDetails({...userDetails, city: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-blue-950 transition-colors"
                        placeholder="Lahore"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">State</label>
                      <input
                        type="text"
                        required
                        value={userDetails.state}
                        onChange={(e) => setUserDetails({...userDetails, state: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-blue-950 transition-colors"
                        placeholder="Punjab"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Country</label>
                      <input
                        type="text"
                        required
                        value={userDetails.country}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-blue-950 transition-colors"
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Full Address</label>
                    <textarea
                      required
                      value={userDetails.address}
                      onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-blue-950 transition-colors resize-none"
                      placeholder="House #, Street, Area..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-950 text-white py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg mt-4"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <button 
                  onClick={() => setStep(1)} 
                  className="mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-950"
                >
                  ← Back to Shipping
                </button>
                <h2 className="text-xl font-serif text-blue-950 mb-6 italic">Select Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className={`p-6 border rounded-sm flex flex-col items-center gap-3 transition-all ${
                        paymentMethod === option.id 
                        ? 'border-blue-950 bg-blue-50/30' 
                        : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-slate-50">
                        {/* In a real app, use the actual logo image */}
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: option.color }}></div>
                      </div>
                      <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">{option.name}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod && (
                  <div className="bg-slate-50 p-6 rounded-sm space-y-4 animate-slideIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Account Holder</p>
                        <p className="text-sm font-bold text-blue-950">{selectedPayment.accountName}</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(selectedPayment.accountName, 'name')}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                      >
                        {copiedField === 'name' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Account / IBAN Number</p>
                        <p className="text-sm font-bold text-blue-950 tracking-widest">{selectedPayment.accountNumber}</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(selectedPayment.accountNumber, 'number')}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                      >
                        {copiedField === 'number' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  disabled={!paymentMethod}
                  onClick={() => setStep(3)}
                  className="w-full bg-blue-950 text-white py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg mt-8 disabled:opacity-50"
                >
                  Confirm Method & Upload Proof
                </button>
              </div>
            )}

            {/* Step 3: Confirmation & Proof */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <button 
                  onClick={() => setStep(2)} 
                  className="mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-950"
                >
                  ← Back to Payment Method
                </button>
                <h2 className="text-xl font-serif text-blue-950 mb-2 italic">Upload Payment Proof</h2>
                <p className="text-sm text-slate-500 mb-8 font-light">Please upload a screenshot of your successful transaction to verify your order.</p>

                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-sm cursor-pointer transition-all ${
                      screenshotUrl 
                      ? 'border-green-200 bg-green-50/30' 
                      : 'border-slate-200 hover:border-blue-950 hover:bg-slate-50'
                    }`}
                  >
                    {screenshotUrl ? (
                      <div className="text-center">
                        <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
                        <p className="text-sm font-bold text-blue-950 mb-1">Screenshot Uploaded</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Click to change</p>
                        <div className="mt-4 max-w-xs mx-auto h-32 rounded border border-slate-100 overflow-hidden">
                          <img src={screenshot ? URL.createObjectURL(screenshot) : screenshotUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={40} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-blue-950 mb-1">Tap to Upload</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">JPG, PNG supported</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="mt-10 p-6 bg-blue-50/30 rounded-sm border border-blue-100">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-950 mb-4">Final Summary</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-bold">Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Delivery Charges</span>
                            <span className="font-bold">Rs. 349</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-blue-100">
                            <span className="text-sm font-black uppercase tracking-widest text-blue-950 underline underline-offset-4">Grand Total</span>
                            <span className="text-2xl font-serif font-black text-blue-950">Rs. {(cartTotal + 349).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <button 
                  disabled={!screenshotUrl || isLoading}
                  onClick={finalizeOrder}
                  className="w-full bg-blue-950 text-white py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl mt-8 disabled:opacity-50"
                >
                  {isLoading ? 'Processing Order...' : 'Finalize & Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-slate-50 rounded-sm p-8 sticky top-28">
            <h3 className="text-lg font-serif font-bold text-blue-950 mb-6 uppercase tracking-wider border-b border-slate-200 pb-4">Order Summary</h3>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 mb-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center text-[8px] text-slate-300 italic">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : 'Photo'}
                    </div>
                    <div className="flex-grow py-1">
                      <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                      <p className="text-xs font-black text-blue-950 mt-2">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-200">
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-slate-500">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-slate-500">
                <span>Shipping</span>
                <span>Rs. 349</span>
              </div>
              <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-dashed border-slate-300">
                <span className="text-xs font-black uppercase tracking-widest text-blue-950">Total</span>
                <span className="text-2xl font-serif font-black text-blue-950">Rs. {(cartTotal + 349).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="p-4 bg-white border border-slate-100 rounded-sm flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-blue-950">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-blue-950">Safe & Secure</p>
                  <p className="text-[9px] text-slate-400">Handled manually for your peace of mind.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
