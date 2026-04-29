import React from 'react';
import { useCart } from '../context/CartContext';

export default function Collection() {
  const { addToCart } = useCart();
  const perfumes = [
    {
      id: '69f1851ab96541709f8bf904',
      name: 'Supreme Oud',
      price: 'Rs. 18,500',
      notes: 'Cambodian Oud, Saffron, Leather',
      image: '/Users/mac/.gemini/antigravity/brain/37ad85f3-e551-40ba-890b-eaf5bb8cd6d0/supreme_oud_bottle_1777432196280.png'
    },
    {
      id: '69f1851ab96541709f8bf905',
      name: 'Dark Mode',
      price: 'Rs. 15,000',
      notes: 'Black Coffee, Incense, Bergamot',
      image: '/Users/mac/.gemini/antigravity/brain/37ad85f3-e551-40ba-890b-eaf5bb8cd6d0/dark_mode_bottle_1777432229934.png'
    },
    {
      id: '69f1851ab96541709f8bf906',
      name: 'Royal Routine',
      price: 'Rs. 16,500',
      notes: 'White Florals, Ambergris, Musk',
      image: '/Users/mac/.gemini/antigravity/brain/37ad85f3-e551-40ba-890b-eaf5bb8cd6d0/royal_routine_bottle_1777432310161.png'
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .group:hover .card-3d {
          transform: rotateY(15deg) rotateX(10deg);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif text-blue-950 tracking-[0.3em] mb-6 uppercase">The Collection</h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto text-lg">A curated selection of our finest olfactory masterpieces. Pure luxury, bottled for the discerning individual.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
          {perfumes.map((perfume) => (
            <div key={perfume.id} className="group perspective-1000 cursor-pointer">
              <div className="relative aspect-[4/5] bg-white shadow-2xl rounded-sm overflow-hidden transition-all duration-700 ease-out preserve-3d card-3d border border-slate-100">
                {/* Product Image */}
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay with details on hover */}
                <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="transform translate-z-10 bg-white/90 backdrop-blur-sm px-8 py-3 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 shadow-xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-950">View Details</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-10 text-center space-y-3">
                <h3 className="text-2xl text-blue-950 font-serif tracking-widest">{perfume.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">{perfume.notes}</p>
                <div className="pt-2">
                  <span className="text-xl font-light text-blue-950 tracking-tighter">{perfume.price}</span>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => addToCart(perfume)}
                    className="w-full py-3 bg-blue-950 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-900 transition-all shadow-lg hover:shadow-blue-950/20 active:scale-95 transform"
                  >
                    Add to Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

