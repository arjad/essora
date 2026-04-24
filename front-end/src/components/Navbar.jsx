import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Navbar({ onCartClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight font-serif lowercase text-primary">
          <a href="/">essora</a>
        </div>

        <div className="hidden md:flex gap-10 text-[13px] font-semibold tracking-wide">
          <a href="/" className="hover:text-gray-600 transition-colors uppercase">Home</a>
          <a href="/about" className="hover:text-gray-600 transition-colors uppercase">About Us</a>
          <a href="/collection" className="hover:text-gray-600 transition-colors uppercase">Collection</a>
          <a href="/contact" className="hover:text-gray-600 transition-colors uppercase">Contact Us</a>
        </div>

        <div className="flex items-center gap-8">
          {isLoggedIn ? (
            <>
              <a href="/profile" className="flex items-center gap-2 text-sm font-medium hover:text-gray-600">
                <User size={18} strokeWidth={2} />
                <span className="hidden sm:inline uppercase">Profile</span>
              </a>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <LogOut size={18} strokeWidth={2} />
                <span className="hidden sm:inline uppercase">Logout</span>
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-sm font-bold uppercase tracking-widest text-primary hover:text-gray-600 transition-colors">Login</a>
              <a href="/signup" className="bg-primary text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20">Sign Up</a>
            </>
          )}

          <button 
            onClick={onCartClick}
            className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 ml-4 border-l border-gray-100 pl-8"
          >
            <ShoppingCart size={18} strokeWidth={2} />
            <span>(1)</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
