import React, { useEffect } from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  
  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onClose();
      navigate('/login');
      return;
    }
    onClose();
    navigate('/checkout');
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
              Shopping Cart
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-950"
          >
            <X size={20} />
          </button>
        </div>

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
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-widest font-bold">Subtotal</span>
                <span className="text-sm font-bold">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-widest font-bold">Delivery</span>
                <span className="text-sm font-bold">Rs. 349</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-[11px] uppercase tracking-widest text-blue-950 font-black underline underline-offset-4">Estimated Total</span>
                <span className="text-xl font-serif font-black text-blue-950">Rs. {(cartTotal + 349).toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleProceedToCheckout}
              className="w-full bg-blue-950 text-white py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-900 transition-all shadow-lg hover:shadow-blue-950/20"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
