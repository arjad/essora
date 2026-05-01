import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageHeading from '../components/PageHeading';

const customDescriptions = {
  "Royal Routine": {
    subtitle: "It is the perfume which gives you the royal Aura.",
    description: "Royal Routine is a refined, modern fragrance designed for the confident professional who values elegance and freshness throughout the day. Crafted to suit workplace environments, this scent delivers a clean, masculine aroma that is noticeable yet never overpowering—perfect for meetings, daily wear, and formal settings.\n\nOpening with fresh citrus notes like bergamot, the fragrance instantly creates a crisp and energetic first impression. As it settles, subtle woody and aromatic accords add depth and sophistication, while a smooth base of musk and amber ensures a long-lasting, polished finish.",
    profileTitle: null,
    profile: [],
    featuresTitle: "Key Features",
    features: [
      "Fresh, clean, and professional fragrance",
      "Notes: Citrus • Woody • Musk • Amber",
      "Long-lasting (6–10 hours approx.)",
      "Perfect for office, meetings, and daily wear",
      "Subtle yet attractive scent profile"
    ],
    whyChooseTitle: "Why Choose It?",
    whyChoose: "A good office perfume should be fresh, light, and not too strong, helping you leave a positive impression without disturbing others.\n\n“Royal Routine” does exactly that—making you feel confident, polished, and memorable every day."
  },
  "Dark Mode": {
    subtitle: "A scent that owns the night.",
    description: "Dark Mode is a bold, seductive fragrance crafted for those who love deep, sweet, and unforgettable scents. This iconic perfume blends rich coffee with soft florals and creamy vanilla, making it one of the most popular modern fragrances.\n\nThe signature coffee note gives it a unique, addictive character, balanced by floral sweetness and a smooth vanilla finish.",
    profileTitle: "Fragrance Profile",
    profile: [
      "Type: Oriental Gourmand (warm & sweet)",
      "Top Notes: Pear, Pink Pepper, Orange Blossom",
      "Heart Notes: Coffee, Jasmine",
      "Base Notes: Vanilla, Patchouli, Cedarwood"
    ],
    featuresTitle: "Key Features & Performance",
    features: [
      "Warm, sweet, and slightly spicy fragrance",
      "Feminine, bold, and sensual scent",
      "Longevity: 6–10+ hours (approx.)",
      "Projection: Moderate to strong",
      "Perfect for nightwear, parties, and winter seasons"
    ],
    whyChooseTitle: "Why People Love It",
    whyChoose: "Dark Mode stands out because of its coffee + vanilla combination, creating a scent that feels luxurious, cozy, and seductive at the same time. It’s often described as addictive and confidence-boosting—ideal for making a strong impression."
  },
  "Supreme Oud": {
    subtitle: "Light Oud, Lasting Impression.",
    description: "Supreme Oud is a soft, elegant interpretation of traditional oud, designed for those who want luxury without overwhelming intensity. Unlike heavy oud fragrances, Supreme Oud offers a cleaner, smoother, and more refined scent—perfect for everyday wear and modern lifestyles.\n\nSupreme Oud opens with a fresh and slightly citrusy touch, then transitions into soft floral elegance. As it dries down, the fragrance becomes warm and creamy with smooth oud, musk, and woody notes—leaving a calm, classy impression.",
    profileTitle: "Fragrance Profile",
    profile: [
      "Type: Soft Oud / Floral Woody (Unisex)",
      "Top Notes: Citrus, Bergamot, Light Spices",
      "Heart Notes: White Florals, Rose, Jasmine, Amber",
      "Base Notes: White Oud, Musk, Sandalwood, Vanilla"
    ],
    featuresTitle: "Key Features",
    features: [
      "Light, clean, and sophisticated oud fragrance",
      "Less intense than traditional oud (easy to wear)",
      "Long-lasting (8–12+ hours approx.)",
      "Perfect for both men & women (unisex)",
      "Ideal for office, daily wear, and casual occasions"
    ],
    whyChooseTitle: "Why Choose Supreme Oud?",
    whyChoose: "Traditional oud can be strong and smoky, but Supreme Oud is modern, balanced, and wearable. It gives you that premium oud feel while staying subtle, making it perfect for people who want a refined signature scent."
  }
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState('idle'); // idle, loading, success

  // Fallback image logic identical to Collection.jsx
  const getProductImage = (name, imgUrl) => {
    if (imgUrl && imgUrl.startsWith('http') && !imgUrl.includes('placeholder')) {
      return imgUrl;
    }
    const nameMap = {
      'royal routine': '/perfumes/royal_routine.png',
      'dark mode': '/perfumes/dark_mode.png',
      'supreme oud': '/perfumes/supreme_oud.png',
      'azure coast': '/perfumes/azure_coast.png',
      'velvet rose': '/perfumes/velvet_rose.png'
    };
    return nameMap[name.toLowerCase()] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const responseData = await response.json();
        const productsArray = responseData.data || [];
        
        const data = productsArray.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase());
        if (!data) throw new Error('Product not found');
        
        // Structure the data for UI
        setProduct({
          id: data._id,
          name: data.name,
          price: data.price,
          formattedPrice: `Rs. ${data.price.toLocaleString()}`,
          oldPrice: data.discountPrice > 0 ? `Rs. ${data.discountPrice.toLocaleString()}` : null,
          category: data.category,
          stock: data.stock,
          image: getProductImage(data.name, data.image_url),
          originalDescription: data.description
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setCartStatus('loading');
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.formattedPrice,
        rawPrice: product.price,
        image: product.image,
        quantity: quantity
      });
      setCartStatus('success');
      setTimeout(() => setCartStatus('idle'), 2000);
    }, 400); // slight delay for feel
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <h2 className="text-3xl font-serif text-blue-950 mb-4">Product Not Found</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <button onClick={() => navigate('/collection')} className="text-blue-900 font-semibold uppercase tracking-widest hover:text-amber-600 transition-colors">
          &larr; Back to Collection
        </button>
      </div>
    );
  }

  const customData = customDescriptions[product.name] || null;

  return (
    <div className="min-h-screen pt-24 pb-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-100 pb-10">
          <div className="flex flex-col">
            <PageHeading 
              title={product.name} 
              align="left" 
              className="!mb-0"
            />
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-blue-950 transition-all mb-2 group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column - Sticky Image */}
          <div className="lg:sticky lg:top-36">
            <div className="relative aspect-square md:aspect-[4/5] bg-neutral-50/50 rounded-sm flex items-center justify-center overflow-hidden border border-neutral-100 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/30 pointer-events-none"></div>
              
              <motion.img 
                initial={{ opacity: 0, scale: 0.9, filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.15))" }}
                animate={{ opacity: 1, scale: 1.1, filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.3))" }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
                src={product.image} 
                alt={product.name} 
                className="w-[120%] h-[120%] max-w-none object-contain relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Mobile Header Info (Visible only on small screens below the image) */}
            <div className="lg:hidden mt-8">
               <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-light text-slate-900">{product.formattedPrice}</span>
                  {product.oldPrice && <span className="text-xl text-slate-400 line-through">{product.oldPrice}</span>}
                </div>
                {customData && <p className="text-lg italic font-serif text-slate-500 mt-4 leading-relaxed">"{customData.subtitle}"</p>}
            </div>
          </div>

          {/* Right Column - Scrollable Details */}
          <div className="flex flex-col">
            
            {/* Desktop Price & Quote */}
            <div className="hidden lg:block mb-10">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-light text-slate-900">{product.formattedPrice}</span>
                {product.oldPrice && <span className="text-xl text-slate-400 line-through">{product.oldPrice}</span>}
              </div>
              {customData && <p className="text-xl italic font-serif text-slate-500 leading-relaxed max-w-xl">"{customData.subtitle}"</p>}
            </div>

            {/* Actions */}
            <div className="py-8 border-y border-neutral-100 mb-10 flex flex-col sm:flex-row gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center border border-slate-200 rounded-sm w-32 h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex justify-center items-center text-slate-400 hover:text-slate-800 transition-colors"
                  disabled={quantity <= 1}
                >-</button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-full flex justify-center items-center text-slate-400 hover:text-slate-800 transition-colors"
                  disabled={quantity >= product.stock}
                >+</button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0 || cartStatus === 'loading'}
                className="flex-1 h-14 bg-blue-950 text-white font-semibold uppercase tracking-widest text-sm hover:bg-blue-900 transition-colors relative overflow-hidden group disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {cartStatus === 'idle' && (
                    <motion.span 
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-0 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </motion.span>
                  )}
                  {cartStatus === 'loading' && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </motion.div>
                  )}
                  {cartStatus === 'success' && (
                    <motion.div 
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center gap-2 bg-green-600 text-white"
                    >
                      <Check className="w-5 h-5" /> Added to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Description Body */}
            <div className="prose prose-lg text-slate-600 font-light leading-relaxed mb-10 max-w-none">
              <h2 className="text-2xl font-serif text-blue-950 tracking-wide uppercase mb-6 border-b border-neutral-100 pb-4">Perfume Details</h2>
              <div className="whitespace-pre-line text-justify mb-8">
                {customData ? customData.description : product.originalDescription}
              </div>

              {customData && customData.profile && customData.profile.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-serif text-blue-950 mb-4">{customData.profileTitle}</h3>
                  <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
                    {customData.profile.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {customData && customData.features && (
                <div className="mb-8 p-8 bg-neutral-50 border border-neutral-100 rounded-sm">
                  <h3 className="text-xl font-serif text-blue-950 mb-4">{customData.featuresTitle}</h3>
                  <ul className="space-y-3">
                    {customData.features.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-amber-600 mr-3 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {customData && customData.whyChoose && (
                <div className="mb-8">
                  <h3 className="text-xl font-serif text-blue-950 mb-4">{customData.whyChooseTitle}</h3>
                  <p className="whitespace-pre-line text-justify">{customData.whyChoose}</p>
                </div>
              )}
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-100">
              <div className="flex items-center text-slate-500 text-sm">
                <Truck className="w-5 h-5 mr-3 text-blue-900" />
                <span>Fast Nationwide Delivery</span>
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <ShieldCheck className="w-5 h-5 mr-3 text-blue-900" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <RotateCcw className="w-5 h-5 mr-3 text-blue-900" />
                <span>Easy Returns Policy</span>
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <Check className="w-5 h-5 mr-3 text-blue-900" />
                <span>{product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
