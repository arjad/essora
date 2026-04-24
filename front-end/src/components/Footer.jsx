import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-slate-300 py-12 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-serif tracking-widest text-white mb-4 block">ESSORA</span>
            <p className="text-sm text-blue-200 mt-4 leading-relaxed">
              Crafting unforgettable olfactory experiences since 2026. Discover the essence of luxury in every bottle.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/collection" className="hover:text-blue-400 transition-colors">The Collection</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-4">Stay Connected</h4>
            <p className="text-sm text-blue-200 mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 w-full text-slate-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button 
                type="submit" 
                className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-blue-900 text-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} Essora Parfums. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
