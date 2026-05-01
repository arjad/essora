import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-sm p-10 md:p-16 shadow-xl border border-slate-100"
        >
          <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-10 text-center uppercase">Privacy Policy</h1>
          <div className="space-y-8 text-slate-600 font-light leading-relaxed">
            <p>At Essora we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.</p>
            
            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">1. Information We Collect</h2>
              <p>When you use our website, we may collect the following information:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Personal details (Name, Email Address, Phone Number)</li>
                <li>Shipping and billing address</li>
                <li>Payment information (processed securely via third-party payment gateways)</li>
                <li>Browsing data (IP address, device, cookies, and usage behavior)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Process and deliver your orders</li>
                <li>Communicate order updates and customer support</li>
                <li>Improve our website and services</li>
                <li>Send promotional offers (only if you agree)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">3. Sharing Your Information</h2>
              <p>We do not sell or rent your personal data. We may share information with:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Trusted delivery partners (for shipping your orders)</li>
                <li>Secure payment providers</li>
                <li>Legal authorities if required by law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">4. Cookies & Tracking</h2>
              <p>Our website uses cookies to enhance your browsing experience. Cookies help us:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Remember your preferences</li>
                <li>Understand website traffic and usage</li>
                <li>Improve performance and user experience</li>
              </ul>
              <p className="mt-2">You can disable cookies in your browser settings if you prefer.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">5. Data Security</h2>
              <p>We take appropriate measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no online system is 100% secure.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Access or update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p className="mt-2">To make any request, contact us at: arjad.uzair@gmail.com</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">7. Third-Party Links</h2>
              <p>Our website may contain links to other websites. We are not responsible for their privacy practices.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">8. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="mt-2 space-y-1">
                <li>📧 Email: arjad.uzair@gmail.com</li>
                <li>📞 Phone: +923703843482</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
