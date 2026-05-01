import React, { useState } from 'react';
import { Snowflake, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "1. Are your perfumes original?",
    answer: "We offer high-quality, carefully selected fragrances. Our fragrances are original and branded."
  },
  {
    question: "2. How long do your perfumes last?",
    answer: "Our fragrances typically last 6–12 hours, depending on the scent type, skin type, and weather conditions."
  },
  {
    question: "3. Do you offer Cash on Delivery (COD)?",
    answer: "Yes, we offer Cash on Delivery (COD) across Pakistan."
  },
  {
    question: "4. How many days does delivery take?",
    answer: "Delivery usually takes 4–7 working days depending on your location."
  },
  {
    question: "5. Can I return or exchange a product?",
    answer: "Yes, we accept returns or exchanges only if the product is damaged, defective, or incorrect. You must contact us within 24–48 hours of delivery."
  },
  {
    question: "6. How can I place an order?",
    answer: "You can place an order directly through our website by adding products to your cart and completing checkout, or by contacting us on WhatsApp."
  },
  {
    question: "7. Which perfume is best for office use?",
    answer: "For office use, we recommend light, fresh, and subtle fragrances such as citrus, aquatic, or soft woody scents. Our “Royal Routine” will be the best choice for daily office use."
  },
  {
    question: "8. Do you have perfumes for both men and women?",
    answer: "Yes, we offer fragrances for men, women, and unisex preferences."
  },
  {
    question: "9. How should I apply perfume for best results?",
    answer: "Apply perfume on pulse points like wrists, neck, and behind the ears. For better performance, apply on moisturized skin. Applying perfume on your clothes will also be helpful for longevity."
  },
  {
    question: "10. How can I contact you?",
    answer: "You can reach us via:\n📞 Phone/WhatsApp: +923703843482\n📧 Email: arjad.uzair@gmail.com"
  },
  {
    question: "11. Do you offer discounts or deals?",
    answer: "Yes, we occasionally offer special deals and discounts. Follow us on social media to stay updated."
  }
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border-b border-gray-200">
    <button 
      onClick={onToggle} 
      className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
    >
      <span className="font-serif text-xl text-primary group-hover:text-blue-800 transition-colors">{faq.question}</span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0 ml-4">
        <ChevronDown size={20} className="text-primary group-hover:text-blue-800 transition-colors" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ height: 0, opacity: 0 }}
           animate={{ height: "auto", opacity: 1 }}
           exit={{ height: 0, opacity: 0 }}
           className="overflow-hidden"
        >
          <div className="pb-8 text-gray-600 font-light text-[15px] leading-relaxed whitespace-pre-line">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  return (
    <div className="min-h-screen pb-20 bg-slate-50 overflow-hidden">
      
      {/* Hero Section */}
      <section className="px-8 mb-32 max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-24 min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <div className="flex items-end mb-4">
            <h1 className="text-[60px] lg:text-[80px] leading-[1.1] font-serif tracking-tight m-0 p-0 text-blue-950">
              Essence that
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <h1 className="text-[60px] lg:text-[80px] leading-[1.1] font-serif tracking-tight m-0 p-0 text-amber-600">
              carries aura
            </h1>
          </div>
          <p className="max-w-[450px] mt-8 text-lg leading-relaxed text-slate-500 font-light">
            Discover a world of timeless scents and unforgettable impressions. Fragrances designed to reflect your personality, mood, and memories.
          </p>
          <div className="mt-10">
            <Link to="/collection" className="inline-block bg-blue-950 text-white px-10 py-5 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-blue-900 transition-colors shadow-xl shadow-blue-900/20">
              Explore Collection
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          className="lg:col-span-5 flex justify-center relative"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-blue-900/5 rounded-full blur-[100px] scale-150"></div>
          
          <img
            src="/perfumes/dark_mode.png"
            alt="Dark Mode Perfume"
            className="w-full max-w-[700px] h-auto object-contain relative z-10 drop-shadow-[0_30px_30px_rgba(0,0,0,0.3)] filter contrast-[1.05] scale-110"
          />
        </motion.div>
      </section>

      {/* Split Section */}
      <section className="px-8 max-w-[1400px] mx-auto mb-32 relative">
        <div className="absolute inset-0 bg-amber-600/5 blur-[120px] rounded-full pointer-events-none scale-150 transform translate-y-1/2"></div>
        
        <div className="border-t border-slate-200 pt-20 grid md:grid-cols-2 gap-16 lg:gap-24 relative z-10">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[40px] lg:text-[52px] leading-[1.15] font-serif text-blue-950 mb-10 tracking-tight">
              A Fragrance Is A Statement, <br/>
              A Memory Left Behind.
            </h2>
            <div className="w-24 border-t-2 border-amber-600 mb-10"></div>
            <p className="text-lg leading-relaxed text-slate-500 font-light mb-8">
              At Essora, we eschew mass production in favor of meticulous craftsmanship. Every bottle is hand-poured and individually inspected, ensuring that the elixir within meets our uncompromising standards of excellence.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-4">
              <div>
                <h4 className="text-blue-950 font-serif text-xl mb-3">Longevity</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  Carefully balanced oils to ensure your scent stays vibrant for up to 12 hours.
                </p>
              </div>
              <div>
                <h4 className="text-blue-950 font-serif text-xl mb-3">Projection</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  A subtle yet powerful aura that fills a room beautifully, but never overwhelms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column Images */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center relative min-h-[500px]"
          >
            {/* Background shapes */}
            <div className="absolute w-[300px] h-[300px] bg-slate-200/50 rounded-sm transform rotate-12 right-0 bottom-0 pointer-events-none"></div>
            
            <div className="absolute z-20 left-0 lg:-left-10 bottom-10 w-[200px] md:w-[250px] drop-shadow-2xl">
              <img src="/perfumes/royal_routine.png" alt="Royal Routine" className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="absolute z-10 right-10 top-0 w-[250px] md:w-[300px] drop-shadow-2xl opacity-90 blur-[1px] hover:blur-none hover:opacity-100 transition-all duration-500">
              <img src="/perfumes/supreme_oud.png" alt="Supreme Oud" className="w-full h-auto object-contain" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Details Section / Highlight */}
      <section className="px-4 sm:px-8 max-w-[1400px] mx-auto text-center mb-32 bg-blue-950 rounded-sm py-24 sm:py-32 relative overflow-hidden shadow-2xl">
        <div className="absolute -left-[300px] -top-[300px] w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -right-[200px] -bottom-[200px] w-[600px] h-[600px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <span className="text-amber-500 uppercase tracking-[0.3em] text-sm font-bold block mb-4">The Crown Jewel</span>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-24 tracking-tight">Supreme Oud</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-[1000px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-right space-y-12 mb-12 md:mb-0"
          >
            <div>
              <h4 className="text-amber-500 font-serif text-xl mb-2">Soft & Elegant</h4>
              <p className="text-blue-100 text-sm font-light leading-relaxed">Unlike heavy oud fragrances, Supreme offers a cleaner scent perfect for daily wear.</p>
            </div>
            <div>
              <h4 className="text-amber-500 font-serif text-xl mb-2">Citrus Burst</h4>
              <p className="text-blue-100 text-sm font-light leading-relaxed">Opens with a fresh, crisp bergamot impression that grabs immediate attention.</p>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
             className="flex justify-center mb-12 md:mb-0"
          >
            <div className="w-[200px] md:w-[300px] h-[300px] md:h-[400px] relative">
               <img src="/perfumes/supreme_oud.png" alt="Supreme Oud Highlight" className="w-full h-full object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.8)] filter contrast-125" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left space-y-12"
          >
            <div>
              <h4 className="text-amber-500 font-serif text-xl mb-2">Creamy Finish</h4>
              <p className="text-blue-100 text-sm font-light leading-relaxed">Dries down into a warm combination of pure musk and smooth Madagascar vanilla.</p>
            </div>
            <div>
              <h4 className="text-amber-500 font-serif text-xl mb-2">Unisex Appeal</h4>
              <p className="text-blue-100 text-sm font-light leading-relaxed">A beautifully balanced profile designed to feel powerful and seductive on anyone.</p>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-20 relative z-10">
           <Link to="/product/supreme-oud" className="inline-block border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-blue-950 px-8 py-3 rounded-sm text-sm font-semibold uppercase tracking-widest transition-all">
             View Product
           </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 pt-10 pb-12 max-w-[900px] mx-auto border-t border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-blue-950 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 font-light">Find answers to our most common inquiries</p>
        </div>
        
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              faq={faq} 
              isOpen={openFaqIndex === index} 
              onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} 
            />
          ))}
        </div>
      </section>

    </div>
  );
}