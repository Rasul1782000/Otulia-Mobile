import React, { useState } from 'react';
import { ArrowLeft, Bell, Heart, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { listings } from '../data';
import { ViewState, Listing } from '../types';

export function ExploreView({ onViewChange, onListingClick, defaultType = 'car', onTypeChange }: { onViewChange: (v: ViewState) => void, onListingClick: (l: Listing) => void, defaultType?: Listing['type'], onTypeChange?: (t: Listing['type']) => void }) {
  const [activeType, setActiveType] = useState<Listing['type']>(defaultType);

  // Update local state when defaultType prop changes
  React.useEffect(() => {
    setActiveType(defaultType);
  }, [defaultType]);

  const handleTypeChange = (type: Listing['type']) => {
    setActiveType(type);
    if (onTypeChange) onTypeChange(type);
  };

  const filteredListings = listings.filter(l => l.type === activeType);

  const typeDetails: Record<Listing['type'], { title: string, subtitle: string, desc: string, bg: string }> = {
    car: { title: 'Cars', subtitle: 'Drive excellence.', desc: 'Explore the world\'s finest cars. Buy or sell with confidence.', bg: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1200' },
    estate: { title: 'Estates', subtitle: 'Extraordinary spaces.', desc: 'Discover the world\'s most exceptional homes and investments.', bg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200' },
    yacht: { title: 'Yachts', subtitle: 'Sail beyond extraordinary.', desc: 'Find the perfect vessel for your maritime adventures.', bg: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200' },
    jet: { title: 'Private Jets', subtitle: 'Jet-set with luxury.', desc: 'Experience unmatched speed and comfort in the skies.', bg: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200' },
    bike: { title: 'Motorcycles', subtitle: 'Two-wheeled perfection.', desc: 'High-performance bikes for the discerning rider.', bg: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200' }
  };

  const currentDetails = typeDetails[activeType] || typeDetails.car;

  return (
    <div className="pb-24 w-full h-full overflow-y-auto">
      {/* Dynamic Header Image & Nav */}
      <div className="relative h-64 bg-black">
        <img 
          src={currentDetails.bg} 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0c]" />
        
        <header className="relative z-10 flex justify-between items-center px-4 py-4 pt-12">
          <button className="text-white" onClick={() => onViewChange('home')}><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center mb-1">
              <div className="w-4 h-4 border border-gold" />
            </div>
            <h1 className="text-lg tracking-widest font-serif font-semibold text-white">OTULIA</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-white"><Heart className="w-6 h-6" /></button>
            <button className="text-white"><Bell className="w-6 h-6" /></button>
          </div>
        </header>

        <div className="relative z-10 px-4 mt-8">
          <h2 className="text-3xl font-serif text-white mb-1">
            {currentDetails.title}
          </h2>
          <h3 className="text-xl font-serif text-gold mb-2">
            {currentDetails.subtitle}
          </h3>
          <p className="text-sm text-zinc-300 w-2/3">
            {currentDetails.desc}
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <section className="px-4 mt-4">
        {/* Search */}
        <div className="bg-zinc-100 dark:bg-dark-surface rounded-xl flex items-center p-3 mb-4 border border-zinc-200 dark:border-dark-border">
          <Search className="w-5 h-5 text-zinc-400 mr-2" />
          <input 
            type="text" 
            placeholder={`Search for ${currentDetails.title.toLowerCase()}...`}
            className="bg-transparent flex-1 outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
          />
          <button className="text-zinc-500 flex items-center gap-1 text-sm"><span className="hidden sm:inline">Filters</span> <SlidersHorizontal className="w-4 h-4" /></button>
        </div>

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 snap-x snap-mandatory scroll-smooth">
          <button className="flex-shrink-0 bg-gold/10 border border-gold text-gold px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 snap-start">
            <div className="flex gap-0.5"><div className="w-2 h-2 bg-gold"/><div className="w-2 h-2 bg-gold"/></div>
            All {currentDetails.title}
          </button>
          {['Make', 'Model', 'Price'].map(chip => (
            <button key={chip} className="flex-shrink-0 bg-zinc-100 dark:bg-dark-surface border border-zinc-200 dark:border-dark-border text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 snap-start">
              {chip} <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>
          ))}
          <button className="flex-shrink-0 bg-zinc-100 dark:bg-dark-surface border border-zinc-200 dark:border-dark-border text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 snap-start">
            More Filters <SlidersHorizontal className="w-4 h-4 ml-1 text-zinc-500" />
          </button>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-zinc-500">{filteredListings.length} {currentDetails.title} Found</span>
          <button className="text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-1">Sort by: Newest <ChevronDown className="w-4 h-4" /></button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-zinc-100 dark:bg-dark-surface rounded-xl overflow-hidden border border-zinc-200 dark:border-dark-border cursor-pointer relative" onClick={() => onListingClick(listing)}>
              <div className="relative h-48">
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                {listing.isFeatured && (
                  <div className="absolute top-3 left-3 bg-gold/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    FEATURED
                  </div>
                )}
                <button className="absolute top-3 right-3 text-white">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-base mb-1">{listing.title}</h4>
                <p className="text-lg font-serif font-bold mb-3">{listing.currency}{listing.price.toLocaleString()}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  {Object.entries(listing.specs).map(([k, v], i) => (
                    <span key={i} className="flex items-center gap-1">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Save Search */}
      <div className="fixed bottom-24 left-4 right-4 bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur border border-zinc-700 dark:border-zinc-700 p-4 rounded-xl flex justify-between items-center z-40">
        <div>
          <h4 className="text-white font-medium text-sm">Save this search</h4>
          <p className="text-zinc-400 text-xs">Get notified when new matches appear.</p>
        </div>
        <button className="bg-gold/20 text-gold border border-gold/50 px-4 py-2 rounded-lg text-sm font-medium">
          Save Search
        </button>
      </div>
    </div>
  );
}
