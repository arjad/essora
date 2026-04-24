import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-4">CONTACT US</h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto">We invite you to reach out to our concierge for styling advice, order inquiries, or private consultations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12 bg-white p-8 md:p-12 shadow-sm rounded-sm">
          {/* Contact Info */}
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-blue-950 mb-6">Concierge Services</h2>
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-800 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-500 mt-1">concierge@essora.com</p>
                <p className="text-sm text-slate-400 mt-1">Expect a reply within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-blue-800 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold text-slate-900">Phone</h3>
                <p className="text-slate-500 mt-1">+1 (800) 555-0199</p>
                <p className="text-sm text-slate-400 mt-1">Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-blue-800 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold text-slate-900">Flagship Boutique</h3>
                <p className="text-slate-500 mt-1">123 Luxury Avenue<br />New York, NY 10022</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-serif text-blue-950 mb-6">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-blue-800 transition-colors bg-transparent"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-blue-800 transition-colors bg-transparent"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  rows="4"
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-blue-800 transition-colors bg-transparent resize-none"
                  placeholder="How can we assist you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-950 text-white font-semibold py-3 px-4 uppercase tracking-wider hover:bg-blue-900 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
