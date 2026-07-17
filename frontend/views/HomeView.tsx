import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Bell, Menu, Search, SlidersHorizontal, Heart } from 'lucide-react-native';
import { categories } from '../data';
import { ViewState, Listing } from '../types';
import { useTheme, colors } from '../theme';
import { getCategoryImageUrl, getHeroImageUrl } from '../lib/images';
import { getFeaturedListings, getListingsByType } from '../lib/api';
import { OptimizedImage } from '../components/OptimizedImage';
import tw from 'twrnc';

const HOME_SECTION_LIMIT = 3;

export function HomeView({ onViewChange, onListingClick, onCategorySelect }: { onCategorySelect: (t: Listing['type']) => void, onViewChange: (v: ViewState) => void, onListingClick: (l: Listing) => void }) {
  const { isDark } = useTheme();
  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [estateListings, setEstateListings] = useState<Listing[]>([]);
  const [carListings, setCarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [featuredRes, estateRes, carRes] = await Promise.all([
          getFeaturedListings(HOME_SECTION_LIMIT),
          getListingsByType('estate', HOME_SECTION_LIMIT),
          getListingsByType('car', HOME_SECTION_LIMIT),
        ]);
        if (!cancelled) {
          if (featuredRes.success) setFeaturedListings(featuredRes.listings);
          if (estateRes.success) setEstateListings(estateRes.listings);
          if (carRes.success) setCarListings(carRes.listings);
        }
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const renderListingCard = useCallback((listing: Listing) => (
    <TouchableOpacity 
      key={listing.id} 
      style={[tw`w-[280px] rounded-[24px] overflow-hidden`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]} 
      onPress={() => onListingClick(listing)}
    >
      <View style={tw`relative h-44`}>
        <OptimizedImage
          src={listing.images[0]?.src ?? ''}
          alt={listing.images[0]?.alt}
          priority="normal"
          resizeMode="cover"
          style={tw`w-full h-full`}
        />
        <View style={[tw`absolute top-3 left-3 px-3 py-1 rounded-full`, { backgroundColor: colors.gold }]}>
          <Text style={tw`text-white text-[10px] font-bold uppercase tracking-widest`}>{listing.type}</Text>
        </View>
        {listing.images.length > 1 && (
          <View style={tw`absolute top-3 right-12 bg-black/50 px-2 py-1 rounded-full`}>
            <Text style={tw`text-white text-[10px] font-bold`}>{listing.images.length}</Text>
          </View>
        )}
        <TouchableOpacity style={tw`absolute top-3 right-3 p-2 bg-black/30 rounded-full`}>
          <Heart size={18} color="white" />
        </TouchableOpacity>
      </View>
      <View style={tw`p-5`}>
        <Text style={[tw`font-bold text-base mb-1`, { color: text }]} numberOfLines={1}>{listing.title}</Text>
        <View style={tw`flex-row items-center gap-1 mb-4`}>
          <Search size={10} color={colors.gold} />
          <Text style={[tw`text-[11px] font-medium uppercase tracking-wider`, { color: textMuted }]}>{listing.location}</Text>
        </View>
        <View style={[tw`flex-row items-center justify-between pt-4`, { borderTopWidth: 1, borderTopColor: border }]}>
          <Text style={[tw`font-bold text-lg`, { color: text }]}>{listing.currency}{listing.price.toLocaleString()}</Text>
          <View style={[tw`px-3 py-1 rounded-lg`, { backgroundColor: colors.goldLight }]}>
            <Text style={[tw`text-[10px] font-bold uppercase tracking-wider`, { color: colors.gold }]}>Details</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [surface, border, text, textMuted, onListingClick]);

  const renderSection = useCallback((title: string, subtitle: string, listings: Listing[], type?: Listing['type']) => (
    <View style={tw`mt-10 px-6`}>
      <View style={tw`flex-row justify-between items-end mb-6`}>
        <View>
          <Text style={[tw`text-2xl font-bold mb-1`, { color: text }]}>{title}</Text>
          <Text style={[tw`text-xs font-medium uppercase tracking-widest`, { color: textMuted }]}>{subtitle}</Text>
        </View>
        <TouchableOpacity onPress={() => { if (type) onCategorySelect(type); onViewChange('explore'); }} style={tw`pb-1`}>
          <Text style={[tw`text-xs font-bold uppercase tracking-wider`, { color: colors.gold }]}>View All →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-5 pb-8`}>
        {listings.map(renderListingCard)}
      </ScrollView>
    </View>
  ), [text, textMuted, renderListingCard, onCategorySelect, onViewChange]);

  return (
    <ScrollView style={[tw`flex-1 pb-24`, { backgroundColor: bg }]} contentContainerStyle={tw`pb-24`}>
      {/* Header */}
      <View style={[tw`flex-row justify-between items-center px-6 py-4 pt-12`, { backgroundColor: bg }]}>
        <TouchableOpacity style={[tw`p-2 rounded-full`, { backgroundColor: surface }]} onPress={() => onViewChange('settings')}>
          <Menu size={20} color={text} />
        </TouchableOpacity>
        <View style={tw`flex-col items-center`}>
          <Image 
            source={require('../images/assets/Otulia logo.jpeg')} 
            style={tw`w-14 h-14 mb-1`}
            resizeMode="contain"
          />
          <Text style={[tw`text-lg tracking-[10px] font-bold ml-2`, { color: text }]}>OTULIA</Text>
        </View>
        <TouchableOpacity style={[tw`p-2 rounded-full`, { backgroundColor: surface }]} onPress={() => onViewChange('inbox')}>
          <Bell size={20} color={text} />
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={tw`px-6 mt-8`}>
        <Text style={[tw`text-4xl mb-1 font-bold leading-tight`, { color: text, fontFamily: 'Playfair Display, serif' }]}>One destination.</Text>
        <Text style={[tw`text-4xl mb-6 italic font-bold leading-tight`, { color: colors.gold, fontFamily: 'Playfair Display, serif' }]}>Every luxury.</Text>
        <Text style={[tw`text-sm mb-8 font-medium leading-5`, { color: textMuted }]}>
          Cars, Real Estate, Bikes & Yachts{"\n"}
          Extraordinary choices. Exceptional lifestyle.
        </Text>

        {/* Hero Showcase Carousel */}
        <View style={tw`mb-8 -mx-6`}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={tw`px-6 gap-4`}
            snapToInterval={336} /* 320px width + 16px gap */
            decelerationRate="fast"
          >
            {categories.map((cat, idx) => (
              <View key={`showcase-${idx}`} style={tw`w-[320px] h-56 rounded-[24px] overflow-hidden relative`}>
                {typeof cat.image === 'number' ? (
                  <Image source={cat.image} style={tw`w-full h-full`} resizeMode="cover" />
                ) : (
                  <OptimizedImage src={getCategoryImageUrl(cat.image)} style={tw`w-full h-full`} resizeMode="cover" priority="high" />
                )}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Search */}
        <View style={[tw`rounded-full flex-row items-center p-2 pl-6 mb-10`, { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e8e8e8', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }]}>
          <Search size={18} color="#999999" style={tw`mr-2`} />
          <TextInput
            placeholder="Search luxury marketplace..."
            placeholderTextColor="#999999"
            style={[tw`flex-1 text-[14px] font-medium`, { color: '#1a1a1a' }]}
          />
          <TouchableOpacity style={tw`bg-black rounded-full p-3`}>
            <SlidersHorizontal size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Browse By Category */}
      <View style={tw`mt-2`}>
        <View style={tw`flex-row justify-between items-end px-6 mb-6`}>
          <View>
            <Text style={[tw`text-2xl font-bold mb-1`, { color: text }]}>Collections</Text>
            <Text style={[tw`text-xs font-medium uppercase tracking-widest`, { color: textMuted }]}>Browse by category</Text>
          </View>
          <TouchableOpacity onPress={() => onViewChange('explore')} style={tw`pb-1`}>
            <Text style={[tw`text-xs font-bold uppercase tracking-wider`, { color: colors.gold }]}>View All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-6 gap-5 pb-6`}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={tw`w-[160px] h-56 rounded-[20px] relative overflow-hidden`} 
              onPress={() => {
                if (cat.type) onCategorySelect(cat.type);
                onViewChange('explore');
              }}
            >
              {typeof cat.image === 'number' ? (
                <Image
                  source={cat.image}
                  style={tw`absolute inset-0 w-full h-full`}
                  resizeMode="cover"
                />
              ) : (
                <OptimizedImage
                  src={getCategoryImageUrl(cat.image)}
                  alt={cat.name}
                  priority="low"
                  resizeMode="cover"
                  style={tw`absolute inset-0 w-full h-full`}
                />
              )}
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
              <View style={tw`absolute inset-0 p-4 justify-end`}>
                <Text style={tw`text-sm font-bold text-white tracking-wider mb-1 uppercase`}>{cat.name}</Text>
                <Text style={tw`text-[10px] font-medium text-zinc-100 uppercase tracking-widest`}>{cat.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Listings */}
      {renderSection('Featured', 'Exclusive selections', featuredListings)}

      {/* Real Estates Section */}
      {renderSection('Real Estates', 'Luxury properties', estateListings, 'estate')}

      {/* Cars Section */}
      {renderSection('Cars', 'Premium vehicles', carListings, 'car')}
    </ScrollView>
  );
}
