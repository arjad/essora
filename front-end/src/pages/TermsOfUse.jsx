import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfUse() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-sm p-10 md:p-16 shadow-xl border border-slate-100"
        >
          <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-10 text-center uppercase">Terms of Use</h1>
          <div className="space-y-8 text-slate-600 font-light leading-relaxed">
            <p>Effective Date: {new Date().toLocaleDateString()}</p>
            
            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Essora, you agree to be bound by these Terms of Use. If you do not agree, please do not use the service.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">2. Use of the Service</h2>
              <p>You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the service.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">3. User Accounts</h2>
              <p>If you create an account:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your login details</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">4. Intellectual Property</h2>
              <p>All content on this service (text, images, logos, etc.) is owned by or licensed to Essora and is protected by intellectual property laws. You may not copy, modify, or distribute content without permission.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">5. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Distribute harmful or malicious content</li>
                <li>Use the service for fraudulent purposes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">6. Termination</h2>
              <p>We reserve the right to suspend or terminate your access at any time, without notice, for conduct that violates these terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">7. Disclaimer of Warranties</h2>
              <p>The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">8. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, Essora will not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">9. Changes to Terms</h2>
              <p>We may update these Terms of Use at any time. Continued use of the service after changes means you accept the updated terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">10. Governing Law</h2>
              <p>These terms are governed by the laws of Pakistan.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-blue-950 mb-3">11. Contact Information</h2>
              <p>If you have questions about these Terms, contact us at:</p>
              <p className="mt-2">arjad.uzair@gmail.com / +923703843482</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
