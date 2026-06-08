import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Bell, Menu, Search, SlidersHorizontal, Heart, Calendar } from 'lucide-react-native';
import { categories, listings } from '../data';
import { ViewState, Listing } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';

export function HomeView({ onViewChange, onListingClick, onCategorySelect }: { onCategorySelect: (t: Listing['type']) => void, onViewChange: (v: ViewState) => void, onListingClick: (l: Listing) => void }) {
  const { isDark } = useTheme();

  return (
    <ScrollView style={tw`flex-1 bg-white pb-24`} contentContainerStyle={tw`pb-24`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 py-4 pt-12 bg-white`}>
        <TouchableOpacity style={tw`p-2 bg-zinc-50 rounded-full`} onPress={() => onViewChange('settings')}>
          <Menu size={20} color={'#27272a'} />
        </TouchableOpacity>
        <View style={tw`flex-col items-center`}>
          <Image 
            source={require('../images/assets/Otulia logo.jpeg')} 
            style={tw`w-14 h-14 mb-1`}
            resizeMode="contain"
          />
          <Text style={tw`text-lg tracking-[10px] font-extrabold text-zinc-900 ml-2`}>OTULIA</Text>
        </View>
        <TouchableOpacity style={tw`p-2 bg-zinc-50 rounded-full`} onPress={() => onViewChange('inbox')}>
          <Bell size={20} color={'#27272a'} />
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={tw`px-6 mt-8 bg-white`}>
        <Text style={tw`text-4xl text-zinc-900 mb-1 font-serif font-extrabold leading-tight`}>One destination.</Text>
        <Text style={[tw`text-4xl mb-6 italic font-serif font-extrabold leading-tight`, { color: colors.gold }]}>Every luxury.</Text>
        <Text style={tw`text-sm text-zinc-600 mb-8 font-bold leading-5`}>
          Cars, Real Estate, Bikes & Yachts{"\n"}
          Extraordinary choices. Exceptional lifestyle.
        </Text>

        {/* Hero Image */}
        <View style={tw`w-full h-56 rounded-[32px] overflow-hidden relative mb-8 shadow-lg`}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200" }}
            style={tw`w-full h-full`}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.25)' }]} />
        </View>

        {/* Search */}
        <View style={tw`bg-zinc-50 rounded-2xl flex-row items-center p-4 mb-10 border border-zinc-100 shadow-sm`}>
          <Search size={20} color="#71717a" style={tw`mr-3`} />
          <TextInput
            placeholder="Search luxury marketplace..."
            placeholderTextColor="#71717a"
            style={tw`flex-1 text-sm text-zinc-900 font-extrabold`}
          />
          <TouchableOpacity style={tw`ml-2`}>
            <SlidersHorizontal size={20} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Browse By Category */}
      <View style={tw`mt-2 bg-white`}>
        <View style={tw`flex-row justify-between items-end px-6 mb-6`}>
          <View>
            <Text style={tw`text-2xl font-extrabold text-zinc-900 mb-1`}>Collections</Text>
            <Text style={tw`text-xs font-extrabold text-zinc-500 uppercase tracking-widest`}>Browse by category</Text>
          </View>
          <TouchableOpacity onPress={() => onViewChange('explore')} style={tw`pb-1`}>
            <Text style={[tw`text-xs font-extrabold uppercase tracking-wider`, { color: colors.gold }]}>View All &rarr;</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-6 gap-5 pb-6`}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={tw`w-[160px] h-56 rounded-[24px] relative overflow-hidden shadow-md`} 
              onPress={() => {
                if (cat.type) onCategorySelect(cat.type);
                onViewChange('explore');
              }}
            >
              <Image source={{ uri: cat.image }} style={tw`absolute inset-0 w-full h-full`} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
              <View style={tw`absolute inset-0 p-4 justify-end`}>
                <Text style={tw`text-sm font-extrabold text-white tracking-wider mb-1 uppercase`}>{cat.name}</Text>
                <Text style={tw`text-[10px] font-extrabold text-zinc-100 uppercase tracking-widest`}>{cat.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Listings */}
      <View style={tw`mt-10 px-6 bg-white`}>
        <View style={tw`flex-row justify-between items-end mb-6`}>
          <View>
            <Text style={tw`text-2xl font-extrabold text-zinc-900 mb-1`}>Featured</Text>
            <Text style={tw`text-xs font-extrabold text-zinc-500 uppercase tracking-widest`}>Exclusive selections</Text>
          </View>
          <TouchableOpacity onPress={() => onViewChange('explore')} style={tw`pb-1`}>
            <Text style={[tw`text-xs font-extrabold uppercase tracking-wider`, { color: colors.gold }]}>Explore &rarr;</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-5 pb-8`}>
          {listings.filter(l => l.isFeatured).map(listing => (
            <TouchableOpacity 
              key={listing.id} 
              style={tw`w-[280px] bg-white rounded-[28px] overflow-hidden border border-zinc-100 shadow-sm`} 
              onPress={() => onListingClick(listing)}
            >
              <View style={tw`relative h-44`}>
                <Image source={{ uri: listing.images[0] }} style={tw`w-full h-full`} />
                <View style={tw`absolute top-3 left-3 bg-[#c19b6c] px-3 py-1 rounded-full shadow-sm`}>
                  <Text style={tw`text-white text-[10px] font-extrabold uppercase tracking-widest`}>{listing.type}</Text>
                </View>
                <TouchableOpacity style={tw`absolute top-3 right-3 p-2 bg-white/20 rounded-full`}>
                  <Heart size={18} color="white" />
                </TouchableOpacity>
              </View>
              <View style={tw`p-5`}>
                <Text style={tw`font-extrabold text-base mb-1 text-zinc-900`} numberOfLines={1}>{listing.title}</Text>
                <View style={tw`flex-row items-center gap-1 mb-4`}>
                  <Search size={10} color={colors.gold} />
                  <Text style={tw`text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider`}>{listing.location}</Text>
                </View>
                <View style={tw`flex-row items-center justify-between border-t border-zinc-50 pt-4`}>
                  <Text style={tw`font-extrabold text-lg text-zinc-900`}>{listing.currency}{listing.price.toLocaleString()}</Text>
                  <View style={[tw`px-3 py-1 rounded-lg`, { backgroundColor: 'rgba(193,155,108,0.1)' }]}>
                    <Text style={[tw`text-[10px] font-extrabold uppercase tracking-wider`, { color: colors.gold }]}>Details</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List Your Luxury Banner */}
      <View style={tw`px-6 mt-6 mb-10`}>
        <TouchableOpacity 
          style={tw`relative w-full h-36 rounded-3xl overflow-hidden flex-row items-center shadow-lg`}
          onPress={() => onViewChange('add-listing')}
        >
          <Image source={{ uri: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200" }} style={tw`absolute inset-0 w-full h-full`} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
          <View style={tw`relative z-10 px-6`}>
            <Text style={[tw`text-xl font-extrabold mb-1`, { color: colors.gold }]}>List your luxury.</Text>
            <Text style={tw`text-sm font-extrabold text-white mb-4`}>Reach the right audience.</Text>
            <View style={[tw`py-2 px-5 rounded-full self-start`, { backgroundColor: colors.gold }]}>
              <Text style={tw`text-white text-xs font-extrabold uppercase tracking-widest`}>Get Started</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
