import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, Bell, Heart, Search, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { listings } from '../data';
import { ViewState, Listing } from '../types';
import { colors } from '../theme';
import tw from 'twrnc';

export function ExploreView({ onViewChange, onListingClick, defaultType, onTypeChange }: { onTypeChange: (t: Listing['type']) => void, defaultType: Listing['type'], onViewChange: (v: ViewState) => void, onListingClick: (l: Listing) => void }) {
  const activeType = defaultType || 'car';
  const filteredListings = listings.filter(l => l.type === activeType);

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-32`}>
        {/* Dynamic Header Image & Nav */}
        <View style={tw`relative h-80 bg-black`}>
          <Image
            source={{ uri: activeType === 'car' ?
              "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1200" : activeType === 'bike' ?
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200" : activeType === 'yacht' ?
              "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200" : activeType === 'jet' ?
              "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200" :
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" }}
            style={[tw`absolute inset-0 w-full h-full`, { opacity: 0.6 }]}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />

          <View style={tw`relative z-10 flex-row justify-between items-center px-6 py-4 pt-12`}>
            <TouchableOpacity onPress={() => onViewChange('home')} style={tw`p-2 bg-black/20 rounded-full`}>
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            <View style={tw`flex-col items-center`}>
              <Image 
                source={require('../images/assets/Otulia logo.jpeg')} 
                style={tw`w-10 h-10 mb-1`}
                resizeMode="contain"
              />
              <Text style={tw`text-lg tracking-[8px] font-black text-white`}>OTULIA</Text>
            </View>
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity style={tw`p-2 bg-black/20 rounded-full`} onPress={() => Alert.alert('Saved', 'Viewing your saved luxury items...')}>
                <Heart size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`p-2 bg-black/20 rounded-full`} onPress={() => onViewChange('inbox')}>
                <Bell size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`relative z-10 px-6 mt-10`}>
            <Text style={tw`text-4xl font-black text-white mb-2`}>
              {activeType === 'car' ? 'Cars' : activeType === 'bike' ? 'Bikes' : activeType === 'yacht' ? 'Yachts' : activeType === 'jet' ? 'Jets' : 'Estates'}
            </Text>
            <View style={tw`flex-row items-center gap-2 mb-4`}>
              <View style={[tw`w-8 h-[2px]`, { backgroundColor: colors.gold }]} />
              <Text style={[tw`text-lg font-black uppercase tracking-widest`, { color: colors.gold }]}>
                {activeType === 'car' ? 'Drive excellence' : activeType === 'bike' ? 'Two-wheel perfection' : activeType === 'yacht' ? 'Ocean-bound freedom' : activeType === 'jet' ? 'Unmatched global reach' : 'Exclusive spaces'}
              </Text>
            </View>
            <Text style={tw`text-sm text-zinc-200 w-3/4 font-black leading-5`}>
              {activeType === 'car' ? 'Explore the world\'s finest automobiles. Curated for the exceptional.' : activeType === 'bike' ? 'Discover the most elite motorcycles engineered for performance and prestige.' : activeType === 'yacht' ? 'Extraordinary vessels built for those who demand the ultimate on water.' : activeType === 'jet' ? 'Private aviation redefined — speed, luxury, and global connectivity.' : 'Discover the world\'s most exceptional homes and architectural masterpieces.'}
            </Text>
          </View>
        </View>

        {/* Filter Section */}
        <View style={tw`px-6 mt-8 bg-white`}>
          {/* Search */}
          <View style={tw`bg-zinc-50 rounded-2xl flex-row items-center p-4 mb-6 border border-zinc-100 shadow-sm`}>
            <Search size={20} color="#71717a" style={tw`mr-3`} />
            <TextInput
              placeholder={activeType === 'car' ? "Search make, model, year..." : activeType === 'estate' ? "Search location, property, style..." : "Search by name, brand, specs..."}
              placeholderTextColor="#71717a"
              style={tw`flex-1 text-sm text-zinc-900 font-black`}
              onSubmitEditing={() => Alert.alert('Search', 'Executing advanced marketplace search...')}
            />
            <TouchableOpacity 
              style={tw`p-1.5 bg-white rounded-lg shadow-sm border border-zinc-100`}
              onPress={() => Alert.alert('Filters', 'Opening advanced filter panel...')}
            >
              <SlidersHorizontal size={16} color={colors.gold} />
            </TouchableOpacity>
          </View>

          {/* Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-3 mb-8`}>
            <TouchableOpacity style={[tw`flex-row items-center gap-2 border px-5 py-2.5 rounded-full shadow-sm`, { backgroundColor: 'rgba(193,155,108,0.1)', borderColor: colors.gold }]}>
              <Text style={[tw`text-xs font-black uppercase tracking-wider`, { color: colors.gold }]}>All {activeType === 'car' ? 'Cars' : activeType === 'bike' ? 'Bikes' : activeType === 'yacht' ? 'Yachts' : activeType === 'jet' ? 'Jets' : 'Estates'}</Text>
            </TouchableOpacity>
            {['Brand', 'Model', 'Price Range', 'Condition'].map(chip => (
              <TouchableOpacity key={chip} style={tw`flex-row items-center gap-1.5 bg-zinc-50 border border-zinc-100 px-5 py-2.5 rounded-full`} onPress={() => Alert.alert('Filter', `Filtering by ${chip}...`)}>
                <Text style={tw`text-xs font-black text-zinc-600 uppercase tracking-wider`}>{chip}</Text>
                <ChevronDown size={14} color="#71717a" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Results Header */}
          <View style={tw`flex-row justify-between items-center mb-6 px-1`}>
            <Text style={tw`text-xs font-black text-zinc-500 uppercase tracking-widest`}>1,248 Results Found</Text>
            <TouchableOpacity style={tw`flex-row items-center gap-1.5`} onPress={() => Alert.alert('Sort', 'Opening sorting options...')}>
              <Text style={tw`text-xs font-black text-zinc-900 uppercase tracking-wider`}>Sort: Newest</Text>
              <ChevronDown size={12} color={colors.gold} />
            </TouchableOpacity>
          </View>

          {/* List */}
          <View style={tw`gap-6`}>
            {filteredListings.map(listing => (
              <TouchableOpacity 
                key={listing.id} 
                style={tw`bg-white rounded-[32px] overflow-hidden border border-zinc-50 shadow-sm`} 
                onPress={() => onListingClick(listing)}
              >
                <View style={tw`relative h-60`}>
                  <Image source={{ uri: listing.images[0] }} style={tw`w-full h-full`} />
                  {listing.isFeatured && (
                    <View style={tw`absolute top-4 left-4 bg-[#c19b6c] px-3 py-1.5 rounded-full shadow-lg`}>
                      <Text style={tw`text-white text-[10px] font-black uppercase tracking-widest`}>Exclusive</Text>
                    </View>
                  )}
                  {listing.images.length > 1 && (
                    <View style={tw`absolute top-4 right-14 bg-black/50 px-2 py-1 rounded-full shadow-lg`}>
                      <Text style={tw`text-white text-[10px] font-black`}>📷 {listing.images.length}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={tw`absolute top-4 right-4 p-2.5 bg-white/20 rounded-full shadow-lg`} onPress={() => Alert.alert('Saved', 'Item added to watchlist.')}>
                    <Heart size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={tw`p-6`}>
                  <View style={tw`flex-row justify-between items-start mb-4`}>
                    <View style={tw`flex-1 mr-4`}>
                      <Text style={tw`font-black text-xl text-zinc-900 mb-1`}>{listing.title}</Text>
                      <View style={tw`flex-row items-center gap-1.5`}>
                        <Search size={10} color={colors.gold} />
                        <Text style={tw`text-xs font-black text-zinc-500 uppercase tracking-wider`}>{listing.location}</Text>
                      </View>
                    </View>
                    <Text style={tw`text-xl font-black text-zinc-900`}>{listing.currency}{listing.price.toLocaleString()}</Text>
                  </View>
                  
                  <View style={tw`flex-row items-center gap-5 border-t border-zinc-50 pt-5`}>
                    {Object.entries(listing.specs).slice(0, 3).map(([k, v], i) => (
                      <View key={i} style={tw`flex-row items-center gap-1.5`}>
                        <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: colors.gold }]} />
                        <Text style={tw`text-[11px] font-black text-zinc-600 uppercase tracking-tight`}>
                          {v}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Save Search */}
      <View style={tw`absolute bottom-24 left-4 right-4 bg-zinc-900 rounded-xl p-4 flex-row justify-between items-center shadow-2xl`}>
        <View>
          <Text style={tw`text-white font-black text-sm`}>Save this search</Text>
          <Text style={tw`text-zinc-400 text-xs font-black`}>Get notified when new matches appear.</Text>
        </View>
        <TouchableOpacity 
          style={[tw`px-4 py-2 rounded-lg border`, { backgroundColor: 'rgba(193,155,108,0.1)', borderColor: colors.gold }]}
          onPress={() => Alert.alert('Search Saved', 'You will receive notifications for this criteria.')}
        >
          <Text style={[tw`text-sm font-black`, { color: colors.gold }]}>Save Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
