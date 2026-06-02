import React from 'react';
import { Home, Compass, Plus, MessageSquare, User, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export function BottomNav({ currentView, onChange }: BottomNavProps) {
  const isAuth = currentView === 'auth';
  if (isAuth) return null;

  const getIconClass = (active: boolean) => 
    cn(
      "w-6 h-6 mb-1 transition-colors",
      active ? "text-gold" : "text-zinc-500 dark:text-zinc-400"
    );

  const getLabelClass = (active: boolean) =>
    cn(
      "text-[10px] font-medium transition-colors",
      active ? "text-gold" : "text-zinc-500 dark:text-zinc-400"
    );

  return (
    <div className="fixed bottom-0 w-full bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-md border-t border-zinc-200 dark:border-dark-border z-50 pb-safe">
      <div className="flex justify-around items-center h-20 px-4 max-w-md mx-auto relative">
        <button className="flex flex-col items-center justify-center w-16" onClick={() => onChange('home')}>
          <Home className={getIconClass(currentView === 'home')} />
          <span className={getLabelClass(currentView === 'home')}>Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16" onClick={() => onChange('explore')}>
          <Compass className={getIconClass(currentView === 'explore')} />
          <span className={getLabelClass(currentView === 'explore')}>Explore</span>
        </button>

        {/* Floating FAB */}
        <div className="flex flex-col items-center justify-center w-20 relative -top-4">
          <button className="w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-800 border-2 border-gold flex items-center justify-center text-gold shadow-lg shadow-gold/20">
            <Plus className="w-8 h-8" />
          </button>
          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">Sell</span>
        </div>

        <button className="flex flex-col items-center justify-center w-16" onClick={() => onChange('inbox')}>
          <MessageSquare className={getIconClass(currentView === 'inbox')} />
          <span className={getLabelClass(currentView === 'inbox')}>Inbox</span>
        </button>

        <button className="flex flex-col items-center justify-center w-16" onClick={() => onChange('profile')}>
          <User className={getIconClass(currentView === 'profile')} />
          <span className={getLabelClass(currentView === 'profile')}>Profile</span>
        </button>
      </div>
    </div>
  );
}
