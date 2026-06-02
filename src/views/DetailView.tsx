import React, { useState } from 'react';
import { ArrowLeft, Heart, Share, Play, Box, CheckCircle2, Calendar, Phone, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Listing, ViewState } from '../types';

export function DetailView({ listing, onViewChange }: { listing: Listing, onViewChange: (v: ViewState) => void }) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!listing) return null;

  return (
    <div className="pb-24 w-full h-full overflow-y-auto bg-white dark:bg-dark-bg">
      {/* Header & Gallery */}
      <div className="relative h-96 bg-black">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0c]" />
        
        <header className="relative z-10 flex justify-between items-center px-4 py-4 pt-12">
          <button className="text-white bg-black/20 p-2 rounded-full backdrop-blur-md" onClick={() => onViewChange('explore')}><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex gap-3">
            <button className="text-white bg-black/20 p-2 rounded-full backdrop-blur-md"><Heart className="w-5 h-5" /></button>
            <button className="text-white bg-black/20 p-2 rounded-full backdrop-blur-md"><Share className="w-5 h-5" /></button>
          </div>
        </header>

        {listing.isFeatured && (
          <div className="absolute top-24 left-4 z-10 bg-gold/90 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
            FEATURED
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded-full z-10">
          1/24
        </div>
        <button className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-xs p-2 rounded-full z-10">
          <Box className="w-4 h-4" />
        </button>

        {/* Thumbnail Strip */}
        <div className="absolute -bottom-10 left-0 w-full px-4 overflow-x-auto no-scrollbar z-20">
          <div className="flex gap-2 pb-2">
            {[1,2,3,4].map((_, i) => (
              <div key={i} className="w-20 h-16 rounded-lg overflow-hidden border border-zinc-700 relative flex-shrink-0">
                <img src={listing.images[0]} className="w-full h-full object-cover" alt="thumb"/>
                {i === 1 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Play className="w-6 h-6 text-white"/></div>}
              </div>
            ))}
            <div className="w-20 h-16 rounded-lg overflow-hidden border border-zinc-700 relative flex-shrink-0 bg-zinc-900 flex items-center justify-center text-white text-sm font-medium">
              +19
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-16">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-serif text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              {listing.title} <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </h1>
            <p className="text-sm text-zinc-500 mt-1">{listing.location}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">{listing.currency}{listing.price.toLocaleString()}</h2>
            {listing.type === 'estate' && <p className="text-xs text-zinc-500 mt-1">€9,668 / m²</p>}
          </div>
        </div>

        {/* Actions row */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <button className="bg-gold/20 text-gold hover:bg-gold hover:text-white transition-colors py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4" /> {listing.type === 'car' ? 'Book Test Drive' : 'Schedule Viewing'}
          </button>
          <button className="bg-zinc-100 dark:bg-dark-surface dark:text-zinc-300 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border border-zinc-200 dark:border-dark-border">
            <Phone className="w-4 h-4" /> Contact
          </button>
          <button className="bg-zinc-100 dark:bg-dark-surface dark:text-zinc-300 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border border-zinc-200 dark:border-dark-border">
            <MessageCircle className="w-4 h-4" /> Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6 border-b border-zinc-200 dark:border-dark-border flex overflow-x-auto no-scrollbar gap-6">
        {['Overview', listing.type === 'car' ? 'Specifications' : 'Details', 'Features', 'Gallery', 'Location'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-gold border-gold' : 'text-zinc-500 border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 mt-6">
        <h3 className="font-serif text-lg mb-3">About this {listing.type === 'estate' ? 'property' : 'car'}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
          The {listing.title} represents the pinnacle of luxury and performance. A meticulously crafted masterpiece delivering extreme power with next-gen technology and unmatched dynamics.
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {Object.entries(listing.specs).map(([k, v], i) => (
            <div key={i} className="bg-zinc-50 dark:bg-dark-surface p-4 rounded-xl border border-zinc-100 dark:border-dark-border flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{k}</span>
              <span className="text-sm font-medium dark:text-zinc-200">{v}</span>
            </div>
          ))}
        </div>

        {/* Dealer Card */}
        <div className="bg-zinc-50 dark:bg-dark-surface p-4 rounded-xl border border-zinc-100 dark:border-dark-border flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gold overflow-hidden">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=128" alt="Dealer" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-medium text-sm flex items-center gap-1">Luxury Motors GmbH <CheckCircle2 className="w-3 h-3 text-gold" /></h4>
              <p className="text-xs text-zinc-500 mt-0.5">Verified Dealer • 4.8 ★ (132 reviews)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500"><Phone className="w-4 h-4"/></button>
            <button className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500"><MessageCircle className="w-4 h-4"/></button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-bg border-t border-zinc-200 dark:border-dark-border p-4 flex justify-between items-center z-50 pb-safe">
        <div>
          <p className="text-lg font-serif font-bold dark:text-white">{listing.currency}{listing.price.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Fair Price</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-lg border border-gold text-gold font-medium text-sm">
            Make an Offer
          </button>
          <button className="px-6 py-3 rounded-lg bg-gold text-white font-medium text-sm">
            {listing.type === 'car' ? 'Buy Now' : 'Request Info'}
          </button>
        </div>
      </div>
    </div>
  );
}
