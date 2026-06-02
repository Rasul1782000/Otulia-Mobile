import React, { useState, useRef } from 'react';
import { ArrowLeft, ImagePlus, Upload } from 'lucide-react';
import { ViewState } from '../types';

export function AddListingView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-24 w-full h-full overflow-y-auto bg-zinc-50 dark:bg-[#0a0a0c]">
      <header className="flex items-center px-4 py-4 pt-12 border-b border-zinc-200 dark:border-dark-border bg-white dark:bg-[#0a0a0c] sticky top-0 z-20">
        <button className="text-zinc-800 dark:text-zinc-100 mr-4" onClick={() => onViewChange('home')}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-50">Create Listing</h1>
      </header>

      <div className="px-4 py-6">
        <h2 className="text-xl font-serif text-zinc-900 dark:text-zinc-50 mb-4">Upload Media</h2>
        
        <div 
          className="w-full h-48 border-2 border-dashed border-zinc-300 dark:border-dark-border rounded-xl flex flex-col items-center justify-center bg-zinc-100 dark:bg-dark-surface cursor-pointer relative overflow-hidden mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <ImagePlus className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Tap to upload photos</span>
              <span className="text-xs text-zinc-400 mt-1">or take a new picture</span>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 block uppercase tracking-wider">Title</label>
            <input type="text" placeholder="e.g. 2024 Lamborghini Revuelto" className="w-full border border-zinc-200 dark:border-dark-border rounded-lg px-3 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-gold" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 block uppercase tracking-wider">Price</label>
              <input type="number" placeholder="0.00" className="w-full border border-zinc-200 dark:border-dark-border rounded-lg px-3 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-gold" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 block uppercase tracking-wider">Currency</label>
              <select className="w-full border border-zinc-200 dark:border-dark-border rounded-lg px-3 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-gold appearance-none">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 block uppercase tracking-wider">Description</label>
            <textarea placeholder="Describe your luxury item..." rows={4} className="w-full border border-zinc-200 dark:border-dark-border rounded-lg px-3 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-gold resize-none" />
          </div>
        </div>

        <button 
          className="w-full bg-zinc-900 dark:bg-gold text-white rounded-xl py-3.5 text-sm font-bold mt-8 shadow-md"
          onClick={() => onViewChange('home')}
        >
          Publish Listing
        </button>
      </div>
    </div>
  );
}
