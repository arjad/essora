import React from 'react';
import { motion } from 'framer-motion';
import PageHeading from '../components/PageHeading';

export default function AboutUs() {
  return (
    <div className="bg-slate-50 min-h-screen pt-8 pb-24 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <PageHeading
          title="About Us"
          subtitle="Where fragrance meets identity."
        />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-3xl mx-auto px-4"
        >
          <div className="space-y-10 text-xl font-light leading-relaxed text-slate-500 text-center">
            <p className="text-3xl font-serif text-blue-950 leading-snug">
              Welcome to <span className="font-bold tracking-wider uppercase text-2xl">Essora</span>, where fragrance meets identity.
            </p>
            
            <p>
              We are passionate about bringing you high-quality perfumes that help you express your personality, style, and confidence through scent.
            </p>

            <p>
              Our journey began with a simple idea—to make premium fragrances accessible, affordable, and suitable for everyday life. Whether you prefer fresh and clean scents for the office, bold and intense fragrances for special occasions, or soft and elegant oud for daily wear, we carefully select each product to match modern tastes.
            </p>

            <p className="py-4 italic font-serif text-2xl text-blue-900/70">
              "At Essora, we believe that a fragrance is more than just a scent, it’s a statement. It creates first impressions, builds memories, and leaves a lasting impact wherever you go."
            </p>

            <p>
              That’s why we focus on offering long-lasting, well-balanced perfumes that suit both men and women. We are committed to quality, customer satisfaction, and trust. From selecting the right fragrances to ensuring smooth delivery, our goal is to give you the best shopping experience.
            </p>

            <div className="py-8">
              <h2 className="text-2xl font-serif text-blue-950 tracking-widest uppercase mb-6">Our Story</h2>
              <p>
                At the heart of our brand lies a passion for timeless scents and unforgettable impressions. What began as a simple love for fine fragrances has grown into a journey of crafting experiences that speak to individuality and elegance. We believe that a fragrance is more than just a scent—it’s a reflection of personality, mood, and memories. Our mission is to bring you carefully curated, high-quality perfumes that blend tradition with modern sophistication. Each bottle we offer is selected with care, ensuring it tells a story, evokes emotion, and leaves a lasting mark wherever you go.
              </p>
            </div>

            <p className="pt-4 text-blue-950 font-serif text-3xl tracking-wide">
              Join us on this journey and discover a scent that truly represents you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
