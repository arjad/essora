import React from 'react';
import { Snowflake } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="px-8 mt-12 mb-20 max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8">
          <div className="flex items-end">
            <p className="w-32 text-sm leading-tight text-gray-800 font-medium mb-4 mr-6">
              Buy Popular Colognes on Sale at a Discount
            </p>
            <h1 className="text-[72px] leading-none font-serif tracking-tight m-0 p-0 text-primary">
              Essence that
            </h1>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <h1 className="text-[72px] leading-none font-serif tracking-tight m-0 p-0 text-primary">
              carries aura
            </h1>
            <div className="relative w-48 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 p-1">
               <div className="w-full h-full rounded-full overflow-hidden bg-primary">
                 <img
                   src="/hero_pill.png"
                   alt="Perfume pill"
                   className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                 />
               </div>
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-primary text-white px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Order Now
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-end">
          <div className="w-[300px] h-[450px] rounded-[150px] overflow-hidden bg-gray-100">
            <img
              src="/hero_bottle.png"
              alt="World class fragrance"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Split Section */}
      <section className="px-8 max-w-[1400px] mx-auto">
        <div className="border-t border-gray-200 grid md:grid-cols-2">
          
          {/* Left Column */}
          <div className="py-16 pr-16 md:border-r border-gray-200 flex flex-col justify-center">
            
            <div className="flex justify-center items-end gap-2 mb-8">
              <div className="w-32 h-48 rounded-t-full overflow-hidden bg-gray-100 border border-gray-200 p-2">
                 <div className="w-full h-full bg-primary rounded-t-full rounded-b-xl overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400" alt="details 1" className="w-full h-full object-cover mix-blend-screen scale-110" />
                 </div>
              </div>
              <div className="w-32 h-48 rounded-t-full overflow-hidden bg-gray-100 border border-gray-200 p-2 relative -top-6">
                 <div className="w-full h-full bg-primary rounded-t-full rounded-b-xl overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?auto=format&fit=crop&q=80&w=400" alt="details 2" className="w-full h-full object-cover mix-blend-screen scale-110" />
                 </div>
              </div>
            </div>

            <div className="text-center font-serif text-2xl tracking-widest text-primary mb-6">. . .</div>
            <p className="max-w-[320px] mx-auto text-center text-[13px] leading-relaxed text-gray-800 font-medium">
              A fragrance is a smell, usually a pleasant or sweet smell. Often perfumes are called fragrances. If you like the fragrance.
            </p>
          </div>

          {/* Right Column */}
          <div className="py-20 pl-16 flex flex-col justify-center">
            <h2 className="text-[52px] leading-[1.1] font-serif text-primary mb-16 tracking-tight">
              A Fragrance Is A Smell, Usually A<br/>
              Pleasant Or 
              <span className="inline-flex items-center mx-4 align-middle">
                <span className="w-24 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center p-0.5">
                   <img src="/hero_pill.png" className="w-full h-full object-cover rounded-full" alt="tiny fragrance" />
                </span>
              </span> 
              Sweet Smell.
            </h2>

            <div className="w-[120px] border-t-2 border-gray-300 mb-12"></div>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <Snowflake size={32} strokeWidth={1} className="mb-6 text-primary" />
                <p className="text-[11px] leading-relaxed text-gray-500 font-medium pr-4">
                  A fragrance is a smell, usually a pleasant or sweet smell. Often perfumes are called fragrances. If you like the fragrance.
                </p>
              </div>
              <div>
                <Snowflake size={32} strokeWidth={1} className="mb-6 text-primary" />
                <p className="text-[11px] leading-relaxed text-gray-500 font-medium pr-4">
                  A fragrance is a pleasant-smelling liquid which people put on their bodies to make themselves smell nice.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Details Section */}
      <section className="px-8 mt-24 max-w-[1400px] mx-auto text-center">
        <h2 className="text-7xl font-serif text-primary mb-24 tracking-tight">More Details For You</h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Constellation Diagram */}
          <div className="relative h-[400px] flex items-center justify-center">
             {/* Center Circle */}
             <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-gray-200"></div>
             <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-gray-200"></div>

             <div className="z-10 w-28 h-28 bg-primary text-white rounded-full flex flex-col items-center justify-center text-xs font-semibold leading-tight shadow-xl">
               <span>Top Note</span>
               <span>Flavours</span>
             </div>

             {/* Pills */}
             <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-100 text-primary px-6 py-2 rounded-full text-xs font-bold w-24 z-20 shadow-sm border border-white">Mandarin</div>
             
             <div className="absolute bottom-12 left-10 bg-gray-100 text-primary px-6 py-2 rounded-full text-xs font-bold w-24 z-20 shadow-sm border border-white">Freesia</div>
             
             <div className="absolute bottom-12 right-10 bg-gray-100 text-primary px-6 py-2 rounded-full text-xs font-bold w-24 z-20 shadow-sm border border-white">Citruses</div>
             
             {/* Connecting dashed lines can be handled by the circular borders conceptually for this stylized diagram */}
          </div>

          {/* About Fragrance */}
          <div className="text-left pl-12 flex flex-col items-center md:items-start">
             <h3 className="text-5xl font-serif text-primary mb-8 w-full text-center">About Fragrance</h3>
             <div className="w-[500px] h-[250px] rounded-[125px] overflow-hidden bg-gray-900 mx-auto">
               <img src="/bottom_bottle.png" alt="About fragrance bottle" className="w-full h-full object-cover opacity-90 scale-105" />
             </div>
          </div>

        </div>
      </section>

    </div>
  );
}