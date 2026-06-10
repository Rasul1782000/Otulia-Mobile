import { useState, useRef } from 'react';
import { View, Animated, StatusBar } from 'react-native';
import { ThemeProvider, useTheme, colors } from './theme';
import { ViewState, Listing, User } from './types';
import { BottomNav } from './components/BottomNav';
import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { DetailView } from './views/DetailView';
import { InboxView } from './views/InboxView';
import { ProfileView } from './views/ProfileView';
import { AddListingView } from './views/AddListingView';
import { SettingsView } from './views/SettingsView';

function AppContent() {
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [exploreType, setExploreType] = useState<Listing['type']>('car');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleViewChange = (view: ViewState) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentView(view);
      if (view !== 'detail') {
        setSelectedListing(null);
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleExploreChange = (type: Listing['type']) => {
    setExploreType(type);
    handleViewChange('explore');
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    handleViewChange('detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <AuthView onViewChange={handleViewChange} onLoginSuccess={setCurrentUser} />;
      case 'home':
        return <HomeView onViewChange={handleViewChange} onListingClick={handleListingClick} onCategorySelect={handleExploreChange} />;
      case 'explore':
        return <ExploreView onViewChange={handleViewChange} onListingClick={handleListingClick} defaultType={exploreType} onTypeChange={setExploreType} />;
      case 'detail':
        return selectedListing ? <DetailView listing={selectedListing} onViewChange={handleViewChange} /> : null;
      case 'add-listing':
        return <AddListingView onViewChange={handleViewChange} />;
      case 'inbox':
        return <InboxView onViewChange={handleViewChange} />;
      case 'profile':
        return <ProfileView onViewChange={handleViewChange} currentUser={currentUser} setCurrentUser={setCurrentUser} />;
      case 'settings':
        return <SettingsView onViewChange={handleViewChange} />;
      default:
        return null;
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: isDark ? colors.dark.bg : '#ffffff' }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? colors.dark.bg : '#ffffff'} />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderView()}
      </Animated.View>
      <BottomNav currentView={currentView} onChange={handleViewChange} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
