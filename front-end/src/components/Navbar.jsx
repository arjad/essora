import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isBouncing, setIsBouncing] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (cartCount > prevCount) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      setPrevCount(cartCount);
      return () => clearTimeout(timer);
    } else if (cartCount !== prevCount) {
      setPrevCount(cartCount);
    }
  }, [cartCount, prevCount]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Collection', path: '/collection' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 -ml-2 text-blue-950 hover:bg-slate-50 rounded-sm transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Essora Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="text-xl md:text-2xl font-serif tracking-[0.2em] text-blue-950 uppercase pt-1">essora</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] uppercase">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`transition-colors ${location.pathname === link.path ? 'text-blue-950' : 'text-slate-400 hover:text-blue-950'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-950 transition-colors">
                  <User size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Account</span>
                </Link>
              </>
            ) : (

              <>
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-blue-950 hover:text-slate-600 transition-colors">Login</Link>
                <Link to="/signup" className="bg-blue-950 text-white px-8 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-lg hover:shadow-blue-950/20">Sign Up</Link>
              </>
            )}
          </div>

          <button 
            onClick={onCartClick}
            className="group flex items-center gap-2 md:gap-3 text-[10px] font-bold uppercase tracking-widest text-blue-950 hover:text-slate-600 md:ml-4 md:border-l border-slate-100 md:pl-8 transition-all"
          >
            <div className={`relative transition-transform duration-300 ease-out ${isBouncing ? 'scale-125 -translate-y-1' : 'scale-100'}`}>
              <ShoppingCart size={20} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-950 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 top-[73px] bg-white z-40 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col p-8 space-y-8">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Navigation</p>
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="flex items-center justify-between text-lg font-serif text-blue-950 group"
              >
                <span>{link.name}</span>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-950 transition-colors" />
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50 space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Member Space</p>
            {isLoggedIn ? (
              <Link to="/profile" className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-sm group hover:bg-blue-950 transition-all">
                <User size={20} className="text-blue-950 group-hover:text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white">Profile</span>
              </Link>
            ) : (
              <div className="space-y-4">
                <Link to="/login" className="block w-full text-center py-4 text-[10px] font-bold uppercase tracking-widest text-blue-950 border border-blue-950 rounded-sm hover:bg-blue-950 hover:text-white transition-all">
                  Login to Account
                </Link>
                <Link to="/signup" className="block w-full text-center py-4 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-950 rounded-sm shadow-lg shadow-blue-950/20 active:scale-[0.98] transition-all">
                  Join Essora
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

