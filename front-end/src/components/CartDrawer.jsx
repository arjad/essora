import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  // Use local storage or state to manage cart items. 
  // For now, we'll use a dummy item to demonstrate the UI.
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Midnight Aura',
      price: '$120.00',
      quantity: 1,
      image: '/hero_pill.png'
    }
  ]);

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="text-lg font-serif font-bold text-primary italic">Your Cart</h2>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-grow overflow-y-auto px-6 py-4">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-primary">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Eau De Parfum</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">{item.price}</p>
                      <div className="flex items-center border border-gray-100 rounded-md">
                        <button className="px-2 py-1 text-gray-400 hover:text-primary">-</button>
                        <span className="px-2 py-1 text-xs font-bold">{item.quantity}</span>
                        <button className="px-2 py-1 text-gray-400 hover:text-primary">+</button>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-red-500 transition-colors p-1 self-start">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-gray-300" />
              </div>
              <h3 className="text-primary font-serif font-bold italic mb-2">Cart is empty</h3>
              <p className="text-xs text-gray-400 max-w-[200px]">Looks like you haven't added any fragrances yet.</p>
              <button 
                onClick={onClose}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Subtotal</span>
              <span className="text-xl font-serif font-bold text-primary italic">$120.00</span>
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg hover:shadow-primary/20">
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
