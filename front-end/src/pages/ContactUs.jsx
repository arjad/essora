import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactUs() {
  const [state, handleSubmit] = useForm("xwvadngo");

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
                <p className="text-slate-500 mt-1">arjad.uzair@gmail.com</p>
                <p className="text-sm text-slate-400 mt-1">Expect a reply within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-blue-800 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold text-slate-900">Phone</h3>
                <p className="text-slate-500 mt-1">+923703843482</p>
                <p className="text-sm text-slate-400 mt-1">Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-blue-800 mt-1 mr-4" />
              <div>
                <h3 className="font-semibold text-slate-900">Address</h3>
                <p className="text-slate-500 mt-1">293 Chauburji Park<br />Lahore, Pakistan</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-serif text-blue-950 mb-6">Send a Message</h2>
            {state.succeeded ? (
              <div className="bg-slate-50 p-8 rounded-sm text-center">
                <h3 className="text-xl font-serif text-blue-950 mb-2">Message Sent</h3>
                <p className="text-slate-500 font-light">Thank you for contacting us. We will get back to you shortly.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-blue-800 transition-colors bg-transparent"
                    placeholder="Jane Doe"
                    required
                  />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-blue-800 transition-colors bg-transparent"
                    placeholder="jane@example.com"
                    required
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-blue-800 transition-colors bg-transparent resize-none"
                    placeholder="How can we assist you?"
                    required
                  ></textarea>
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                  />
                </div>
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-blue-950 text-white font-semibold py-3 px-4 uppercase tracking-wider hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

