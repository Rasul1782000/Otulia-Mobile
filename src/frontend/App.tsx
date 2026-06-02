/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './theme';
import { ViewState, Listing } from './types';
import { BottomNav } from './components/BottomNav';
import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { DetailView } from './views/DetailView';
import { InboxView } from './views/InboxView';
import { ProfileView } from './views/ProfileView';
import { AddListingView } from './views/AddListingView';

// Wrapper for animated view transitions
const AnimatedView = ({ children, viewKey }: { children: React.ReactNode, viewKey: string }) => (
  <motion.div
    key={viewKey}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className="absolute inset-0 w-full h-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [exploreType, setExploreType] = useState<Listing['type']>('car');

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (view !== 'detail') {
      setSelectedListing(null);
    }
  };

  const handleExploreChange = (type: Listing['type']) => {
    setExploreType(type);
    setCurrentView('explore');
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
  };

  return (
    <ThemeProvider>
      <div className="flex bg-zinc-100 dark:bg-black w-full h-screen items-center justify-center">
        <div className="w-full h-full sm:h-[600px] sm:max-h-[85vh] sm:w-[280px] bg-zinc-50 dark:bg-[#0a0a0c] overflow-hidden relative font-sans sm:shadow-2xl sm:rounded-[36px] sm:border-[8px] sm:border-zinc-900">
          
          {/* View Routing */}
          <div className="w-full h-full relative z-0">
            <AnimatePresence mode="wait">
              {currentView === 'auth' && (
                <AnimatedView viewKey="auth">
                  <AuthView onViewChange={handleViewChange} />
                </AnimatedView>
              )}
              {currentView === 'home' && (
                <AnimatedView viewKey="home">
                  <HomeView onViewChange={handleViewChange} onListingClick={handleListingClick} onCategorySelect={handleExploreChange} />
                </AnimatedView>
              )}
              {currentView === 'explore' && (
                <AnimatedView viewKey="explore">
                  <ExploreView onViewChange={handleViewChange} onListingClick={handleListingClick} defaultType={exploreType} onTypeChange={setExploreType} />
                </AnimatedView>
              )}
              {currentView === 'detail' && selectedListing && (
                <AnimatedView viewKey="detail">
                  <DetailView listing={selectedListing} onViewChange={handleViewChange} />
                </AnimatedView>
              )}
              {currentView === 'add-listing' && (
                <AnimatedView viewKey="add-listing">
                  <AddListingView onViewChange={handleViewChange} />
                </AnimatedView>
              )}
              {currentView === 'inbox' && (
                <AnimatedView viewKey="inbox">
                  <InboxView />
                </AnimatedView>
              )}
              {currentView === 'profile' && (
                <AnimatedView viewKey="profile">
                  <ProfileView />
                </AnimatedView>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <BottomNav currentView={currentView} onChange={handleViewChange} />
          
          {/* Safe Area for Mobile (notch / bottom bar) simulated */}
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[20px] bg-zinc-900 rounded-b-[16px] z-50"></div>
        </div>
      </div>
    </ThemeProvider>
  );
}
