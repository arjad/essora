import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-sm p-10 md:p-16 shadow-xl border border-slate-100"
        >
          <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-10 text-center uppercase">Terms of Service</h1>
          <div className="space-y-8 text-slate-600 font-light leading-relaxed">
            <p>Welcome to ESSORA. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.</p>
            
            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">1. General</h2>
              <p>By using our website, you confirm that you are at least 18 years old or using it under the supervision of a parent or guardian. We reserve the right to update or modify these terms at any time without prior notice.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">2. Products & Services</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All products are subject to availability.</li>
                <li>We make every effort to display accurate product descriptions and images, but slight variations may occur.</li>
                <li>Prices are subject to change without notice.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">3. Orders & Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Once you place an order, you will receive confirmation.</li>
                <li>We reserve the right to cancel or refuse any order due to stock issues, pricing errors, or suspicious activity.</li>
                <li>Payments are processed securely through trusted payment methods or Cash on Delivery (COD), where available.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">4. Shipping & Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Delivery times may vary depending on your location.</li>
                <li>We are not responsible for delays caused by courier services or unforeseen circumstances.</li>
                <li>Customers must provide accurate shipping information.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">5. Returns & Refunds</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Returns are only accepted for damaged, defective, or incorrect products.</li>
                <li>Claims must be made within 14 days of delivery.</li>
                <li>The product must be unused and in original packaging.</li>
                <li>Refunds or exchanges will be processed after verification.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">6. Intellectual Property</h2>
              <p>All content on this website, including logos, images, text, and designs, is the property of Essora and may not be used without permission.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">7. User Conduct</h2>
              <p>You agree not to misuse our website for any unlawful activity, including fraud, hacking, or spreading harmful content.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">8. Limitation of Liability</h2>
              <p>We are not liable for any indirect, incidental, or consequential damage resulting from the use of our products or website.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">9. Privacy</h2>
              <p>Your use of our website is also governed by our Privacy Policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">10. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
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
