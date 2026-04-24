import React from 'react';

export default function Collection() {
  const perfumes = [
    { id: 1, name: 'Midnight Aura', price: '$120', notes: 'Oud, Rose, Vanilla' },
    { id: 2, name: 'Oceanic Breeze', price: '$95', notes: 'Sea Salt, Bergamot, Amber' },
    { id: 3, name: 'Velvet Noir', price: '$140', notes: 'Patchouli, Black Pepper, Leather' },
    { id: 4, name: 'Golden Amber', price: '$110', notes: 'Amber, Sandalwood, Jasmine' },
    { id: 5, name: 'Royal Iris', price: '$135', notes: 'Iris, Cedar, Musk' },
    { id: 6, name: 'Citrus Bloom', price: '$85', notes: 'Neroli, Grapefruit, Vetiver' },
  ];

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-4">THE COLLECTION</h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto">Explore our full range of masterfully crafted fragrances, designed to elevate your everyday moments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {perfumes.map((perfume) => (
            <div key={perfume.id} className="group cursor-pointer flex flex-col">
              <div className="w-full aspect-[4/5] bg-slate-100 flex items-center justify-center mb-6 overflow-hidden relative">
                 <div className="absolute inset-0 bg-blue-950 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                 <span className="text-slate-400 font-serif tracking-widest">{perfume.name.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl text-blue-950 font-serif tracking-wide group-hover:text-blue-800 transition-colors">{perfume.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 italic">{perfume.notes}</p>
                </div>
                <span className="text-lg font-semibold text-blue-950">{perfume.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
