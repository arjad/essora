import React from 'react';

export default function AboutUs() {
  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-serif text-blue-950 tracking-widest mb-8">OUR STORY</h1>
        <div className="w-24 h-1 bg-blue-900 mx-auto mb-12"></div>
        <div className="prose prose-lg mx-auto text-slate-700 font-light leading-relaxed">
          <p className="mb-6 text-xl">
            Founded in 2026, Essora was born from a singular vision: to redefine luxury perfumery by returning to the essence of artistry.
          </p>
          <p className="mb-6">
            We believe that a fragrance is more than just a scent; it is an invisible garment, a lingering memory, and a deeply personal signature. Our master perfumers traverse the globe to source the rarest, most exquisite raw materials, ethically harvesting ingredients that tell a story of their origin.
          </p>
          <p>
            At Essora, we eschew mass production in favor of meticulous craftsmanship. Every bottle is hand-poured and individually inspected, ensuring that the elixir within meets our uncompromising standards of excellence. Welcome to the world of Essora, where your olfactory journey awaits.
          </p>
        </div>
      </div>
    </div>
  );
}
