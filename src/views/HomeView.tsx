import React from 'react';
import { Bell, Menu, Search, SlidersHorizontal, Heart, Calendar } from 'lucide-react';
import { categories, listings } from '../data';
import { cn } from '../lib/utils';
import { ViewState, Listing } from '../types';

export function HomeView({ onViewChange, onListingClick }: { onViewChange: (v: ViewState) => void, onListingClick: (l: Listing) => void }) {
  return (
    <div className="pb-24 w-full h-full overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 pt-12">
        <button className="text-zinc-800 dark:text-zinc-100"><Menu className="w-6 h-6" /></button>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center mb-1">
            <div className="w-4 h-4 border border-gold" />
          </div>
          <h1 className="text-lg tracking-widest font-serif font-semibold text-zinc-900 dark:text-zinc-50">OTULIA</h1>
          <p className="text-[8px] uppercase tracking-widest text-zinc-500">All in one luxury marketplace</p>
        </div>
        <button className="text-zinc-800 dark:text-zinc-100"><Bell className="w-6 h-6" /></button>
      </header>

      {/* Hero */}
      <section className="px-4 mt-6">
        <h2 className="text-4xl font-serif text-zinc-900 dark:text-zinc-50 mb-1">One destination.</h2>
        <h2 className="text-4xl font-serif text-gold mb-4 italic">Every luxury.</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">
          Cars, Real Estate, Bikes & Yachts<br/>
          Extraordinary choices. Exceptional lifestyle.
        </p>

        {/* Hero Image */}
        <div className="w-full h-48 rounded-2xl overflow-hidden relative mb-6">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" 
            alt="Mansion and Car" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Search */}
        <div className="bg-zinc-100 dark:bg-dark-surface rounded-xl flex items-center p-3 mb-8 border border-zinc-200 dark:border-dark-border">
          <Search className="w-5 h-5 text-zinc-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search for cars, properties, bikes or yachts" 
            className="bg-transparent flex-1 outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
          />
          <button className="text-gold"><SlidersHorizontal className="w-5 h-5" /></button>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="mt-2">
        <div className="flex justify-between items-center px-4 mb-4">
          <h3 className="text-lg font-serif">Browse By Category</h3>
          <button className="text-xs text-zinc-500 flex items-center" onClick={() => onViewChange('explore')}>View all &gt;</button>
        </div>
        <div className="flex overflow-x-auto px-4 gap-4 no-scrollbar pb-4">
          {categories.map((cat) => (
            <div key={cat.id} className="min-w-[140px] h-48 rounded-xl relative overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => onViewChange('explore')}>
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
              <div className="absolute inset-0 p-3 flex flex-col pt-4">
                <span className="text-xs font-semibold text-white tracking-wider mb-1">{cat.name}</span>
                <span className="text-[10px] text-zinc-300">{cat.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mt-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-serif">Featured Listings</h3>
          <button className="text-xs text-zinc-500 flex items-center" onClick={() => onViewChange('explore')}>View all &gt;</button>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 -mx-4 px-4">
          {listings.filter(l => l.isFeatured).map(listing => (
            <div key={listing.id} className="min-w-[240px] bg-zinc-100 dark:bg-dark-surface rounded-xl overflow-hidden border border-zinc-200 dark:border-dark-border cursor-pointer flex-shrink-0" onClick={() => onListingClick(listing)}>
              <div className="relative h-32">
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-gold/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {listing.type}
                </div>
                <button className="absolute top-2 right-2 text-white">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-1 line-clamp-1">{listing.title}</h4>
                <p className="text-xs text-zinc-500 mb-2">{listing.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-sm">{listing.currency}{listing.price.toLocaleString()}</span>
                  <div className="flex items-center text-[10px] text-zinc-400 gap-2">
                    {Object.entries(listing.specs).slice(0, 2).map(([k, v], i) => (
                      <span key={i} className="flex items-center gap-1">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* List Your Luxury Banner */}
      <section className="px-4 mt-6">
        <div className="relative w-full h-32 rounded-xl overflow-hidden flex items-center">
          <img src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover" alt="Yacht" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/40" />
          <div className="relative z-10 px-6">
            <h3 className="text-xl font-serif text-gold mb-1">List your luxury.</h3>
            <p className="text-sm text-white mb-3">Reach the right audience.</p>
            <button className="bg-gold hover:bg-gold-hover text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
              List Your Item &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
