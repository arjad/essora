import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Check } from 'lucide-react';
import PageHeading from '../components/PageHeading';

const PerfumeCard = ({
  id,
  name,
  description,
  price,
  oldPrice,
  rating,
  image,
  badgeText,
  badgeBg,
  delay = 0,
  onAddToCart
}) => {
  const [added, setAdded] = useState(false);
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const handleAddToCart = () => {
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="group flex flex-col bg-white rounded-[3.5rem] shadow-sm border border-neutral-100 relative h-full overflow-hidden"
    >
      {/* Image Area with Sale Badge - Full Bleed */}
      <div className="relative aspect-square flex items-center justify-center bg-neutral-50/30">
        <div className={`absolute top-6 right-6 z-10 ${badgeBg} text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 shadow-md rounded-full`}>
          {badgeText}
        </div>
        <Link to={`/product/${slug}`} className="absolute inset-0 flex items-center justify-center z-10">
          <motion.img 
            whileHover={{ scale: 1.3 }}
            initial={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 200 }}
            src={image} 
            alt={name} 
            className="w-[130%] h-[130%] max-w-none object-contain relative drop-shadow-[0_20px_20px_rgba(0,0,0,0.35)]"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="absolute inset-0 bg-neutral-100/50 rounded-full scale-90 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
      </div>

      {/* Padded Content */}
      <div className="p-8 pt-6 pb-12 flex flex-col flex-1">
        {/* Name & Description */}
        <div className="mb-2">
          <Link to={`/product/${slug}`}>
            <h3 className="text-xl font-serif tracking-wide hover:text-blue-900 transition-colors">{name}</h3>
          </Link>
          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1 leading-tight">
            {description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex gap-0.5 mb-6 opacity-60">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={10} 
              fill={i < Math.floor(rating) ? "currentColor" : "none"} 
              className="text-amber-500" 
            />
          ))}
        </div>

        {/* Bottom: Price and Cart Icon */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-50 pt-4 gap-2">
          <div className="flex flex-col min-w-0">
            {oldPrice && <span className="text-[10px] text-slate-400 line-through opacity-40 font-bold mb-0.5 truncate">{oldPrice}</span>}
            <span className="text-xl font-serif text-blue-950 truncate">{price}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`w-10 h-10 ${added ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20' : 'bg-blue-950 hover:bg-blue-900 shadow-blue-900/20'} text-white rounded-full flex items-center justify-center transition-all shadow-lg shrink-0 group/btn`}
          >
            {added ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check size={18} strokeWidth={3} />
              </motion.div>
            ) : (
              <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Collection() {
  const { addToCart } = useCart();
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/products');
        if (response.ok) {
          const responseData = await response.json();
          const productsArray = responseData.data || [];
          // Transform db data to UI format
          const formattedData = productsArray.map(p => ({
            id: p._id,
            name: p.name,
            price: `Rs. ${p.price.toLocaleString()}`,
            rawPrice: p.price,
            oldPrice: p.discountPrice && p.discountPrice > 0 ? `Rs. ${p.discountPrice.toLocaleString()}` : '',
            rating: 5,
            badgeText: p.isFeatured ? 'Featured' : (p.onSale ? 'Sale' : 'Collection'),
            badgeBg: p.isFeatured ? 'bg-amber-600' : (p.onSale ? 'bg-emerald-600' : 'bg-blue-950'),
            notes: p.description,
            // Fallback to local nice images if it matches previous hardcoded items
            image: (p.name.toLowerCase().includes('supreme oud')) ? '/perfumes/supreme_oud.png' 
                 : (p.name.toLowerCase().includes('dark mode')) ? '/perfumes/dark_mode.png'
                 : (p.name.toLowerCase().includes('royal routine')) ? '/perfumes/royal_routine.png'
                 : (p.image_url || '/perfumes/supreme_oud.png'),
          }));
          setPerfumes(formattedData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeading title="The Collection" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 md:px-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white rounded-[3.5rem] shadow-sm border border-neutral-100 h-full overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100/80"></div>
                <div className="p-8 pt-6 pb-12 flex flex-col flex-1 space-y-4">
                  <div className="h-5 bg-slate-100 rounded-full w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-1/2"></div>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-3 h-3 rounded-full bg-slate-100"></div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between">
                    <div className="h-6 bg-slate-100 rounded-full w-24"></div>
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeading
          title="The Collection"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 md:px-8">
          {perfumes.map((perfume, index) => (
            <PerfumeCard
              key={perfume.id}
              id={perfume.id}
              name={perfume.name}
              description={perfume.notes}
              price={perfume.price}
              oldPrice={perfume.oldPrice}
              rating={perfume.rating}
              image={perfume.image}
              badgeText={perfume.badgeText}
              badgeBg={perfume.badgeBg}
              delay={index * 0.1}
              onAddToCart={() => addToCart(perfume)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

