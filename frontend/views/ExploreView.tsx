import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, Bell, Heart, Search, X, ChevronDown } from 'lucide-react-native';

import { ViewState, Listing } from '../types';
import { useTheme, colors } from '../theme';
import { getHeroImageUrl } from '../lib/images';
import { getListingsByType, getBrandsByType } from '../lib/api';
import { OptimizedImage } from '../components/OptimizedImage';
import { FilterPanel, EMPTY_FILTERS, FilterState } from '../components/FilterPanel';
import tw from 'twrnc';

const CATEGORY_TABS: { label: string; value: Listing['type'] }[] = [
  { label: 'All', value: 'car' },
  { label: 'Cars', value: 'car' },
  { label: 'Real Estate', value: 'estate' },
  { label: 'Yachts', value: 'yacht' },
  { label: 'Bikes', value: 'bike' },
];

const CATEGORY_IMAGES: Record<Listing['type'], number> = {
  car: require('../images/assets/Cars Category BG.png'),
  estate: require('../images/assets/Estates category photo.png'),
  yacht: require('../images/assets/Yachts Category photo.png'),
  jet: require('../images/assets/Jet homepage category photo.png'),
  bike: require('../images/assets/Cars Category BG.png'),
};

export function ExploreView({ onViewChange, onListingClick, defaultType, onTypeChange }: { onTypeChange: (t: Listing['type']) => void, defaultType: Listing['type'], onViewChange: (v: ViewState) => void, onListingClick: (l: Listing) => void }) {
  const { isDark } = useTheme();
  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  const activeType = defaultType || 'car';
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 5;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [activeTab, setActiveTab] = useState<Listing['type']>(activeType);

  useEffect(() => {
    setActiveTab(activeType);
  }, [activeType]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setFilters(EMPTY_FILTERS);
      setSearchQuery('');
      setPage(1);
      setHasMore(true);
      try {
        const [listingsRes, brandsRes] = await Promise.all([
          getListingsByType(activeTab === 'car' ? 'car' : activeTab, PAGE_SIZE, 1),
          getBrandsByType(activeTab === 'car' ? 'car' : activeTab),
        ]);
        if (!cancelled) {
          if (listingsRes.success) {
            setAllListings(listingsRes.listings || []);
            setHasMore((listingsRes.listings?.length || 0) >= PAGE_SIZE);
          }
          if (brandsRes.success) {
            setBrands(brandsRes.brands);
            setAllBrands(prev => [...new Set([...prev, ...(brandsRes.brands || [])])]);
          }
        }
      } catch (err) {
        console.warn('Explore load error', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  const parseRange = (val: string | null | undefined): [number, number] | null => {
    if (!val) return null;
    const parts = val.split('-').map(Number);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    return [parts[0], parts[1]];
  };

  const matchesSpecRange = (specs: Record<string, string>, key: string, range: [number, number] | null): boolean => {
    if (!range) return true;
    const val = specs[key];
    if (!val) return false;
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
    return !isNaN(num) && num >= range[0] && num <= range[1];
  };

  const matchesSpecContains = (specs: Record<string, string>, key: string, value: string | null): boolean => {
    if (!value) return true;
    const val = specs[key];
    if (!val) return false;
    return val.toLowerCase().includes(value.toLowerCase());
  };

  const matchesPriceRange = (price: number, range: [number, number] | null): boolean => {
    if (!range) return true;
    return price >= range[0] && price <= range[1];
  };

  const filteredListings = useMemo(() => {
    let result = allListings;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q)
      );
    }

    if (filters.brand) {
      result = result.filter(l => l.brand === filters.brand);
    }

    const priceRange = parseRange(filters.priceRange);
    if (priceRange) {
      result = result.filter(l => matchesPriceRange(l.price, priceRange));
    }

    if (activeTab === 'car') {
      if (filters.year) {
        const minYear = parseInt(filters.year, 10);
        result = result.filter(l => {
          const year = parseInt(l.specs?.year?.toString() || '0', 10);
          if (filters.year === '2017') return year <= 2017;
          return year >= minYear && year < minYear + 2;
        });
      }
      if (filters.fuel) {
        result = result.filter(l => matchesSpecContains(l.specs, 'fuel', filters.fuel));
      }
      if (filters.mileage) {
        const range = parseRange(filters.mileage);
        if (range) {
          result = result.filter(l => matchesSpecRange(l.specs, 'mileage', range));
        }
      }
    }

    if (activeTab === 'estate') {
      if (filters.propertyType) {
        result = result.filter(l => matchesSpecContains(l.specs, 'type', filters.propertyType));
      }
      if (filters.bedrooms) {
        const minBeds = parseInt(filters.bedrooms, 10);
        result = result.filter(l => {
          const beds = parseInt(l.specs?.bedrooms?.toString() || '0', 10);
          return beds >= minBeds;
        });
      }
      if (filters.bathrooms) {
        const minBaths = parseInt(filters.bathrooms, 10);
        result = result.filter(l => {
          const baths = parseInt(l.specs?.bathrooms?.toString() || '0', 10);
          return baths >= minBaths;
        });
      }
    }

    if (activeTab === 'bike') {
      if (filters.bikeType) {
        result = result.filter(l => matchesSpecContains(l.specs, 'type', filters.bikeType));
      }
    }

    if (activeTab === 'yacht') {
      if (filters.yachtType) {
        result = result.filter(l => matchesSpecContains(l.specs, 'type', filters.yachtType));
      }
      if (filters.yachtLength) {
        const range = parseRange(filters.yachtLength);
        if (range) {
          result = result.filter(l => matchesSpecRange(l.specs, 'length', range));
        }
      }
    }

    // Sort
    if (sortBy === 'Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allListings, searchQuery, filters, activeTab, sortBy]);

  const typeLabel = activeTab === 'car' ? 'Cars' : activeTab === 'bike' ? 'Bikes' : activeTab === 'yacht' ? 'Yachts' : activeTab === 'jet' ? 'Jets' : 'Estates';

  return (
    <View style={[tw`flex-1`, { backgroundColor: bg }]}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-32`}>
        {/* Dynamic Header Image & Nav */}
        <View style={tw`relative h-80 bg-black`}>
          <Image
            source={CATEGORY_IMAGES[activeTab]}
            style={[tw`absolute inset-0 w-full h-full`, { opacity: 0.6 }]}
            resizeMode="cover"
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
            <Text style={tw`text-4xl font-black text-white mb-2`}>{typeLabel}</Text>
            <View style={tw`flex-row items-center gap-2 mb-4`}>
              <View style={[tw`w-8 h-[2px]`, { backgroundColor: colors.gold }]} />
              <Text style={[tw`text-lg font-black uppercase tracking-widest`, { color: colors.gold }]}>
                {activeTab === 'car' ? 'Drive excellence' : activeTab === 'bike' ? 'Two-wheel perfection' : activeTab === 'yacht' ? 'Ocean-bound freedom' : activeTab === 'jet' ? 'Unmatched global reach' : 'Exclusive spaces'}
              </Text>
            </View>
            <Text style={tw`text-sm text-zinc-200 w-3/4 font-black leading-5`}>
              {activeTab === 'car' ? 'Explore the world\'s finest automobiles. Curated for the exceptional.' : activeTab === 'bike' ? 'Discover the most elite motorcycles engineered for performance and prestige.' : activeTab === 'yacht' ? 'Extraordinary vessels built for those who demand the ultimate on water.' : activeTab === 'jet' ? 'Private aviation redefined — speed, luxury, and global connectivity.' : 'Discover the world\'s most exceptional homes and architectural masterpieces.'}
            </Text>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={[tw`py-4 border-b`, { borderColor: border, backgroundColor: bg }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-6 gap-3`}>
            {CATEGORY_TABS.map(tab => (
              <TouchableOpacity
                key={tab.value + tab.label}
                onPress={() => { setActiveTab(tab.value); onTypeChange(tab.value); }}
                style={[
                  tw`px-6 py-2.5 rounded-full`,
                  activeTab === tab.value && tab.label !== 'All'
                    ? { backgroundColor: '#111111' }
                    : activeTab === tab.value && tab.label === 'All'
                      ? { backgroundColor: '#111111' }
                      : { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e8e8e8' },
                ]}
              >
                <Text style={[
                  tw`text-[13px] font-medium`,
                  { color: activeTab === tab.value ? '#ffffff' : '#666666' },
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Panel */}
        <View style={tw`mt-6`}>
          <FilterPanel
            activeType={activeTab}
            filters={filters}
            onFiltersChange={setFilters}
            brands={brands}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={() => {}}
          />
        </View>

        {/* Results Header */}
        <View style={tw`px-6 mt-6 flex-row justify-between items-center`}>
          <Text style={[tw`text-xs font-bold uppercase tracking-widest`, { color: textMuted }]}>
            {filteredListings.length} {filteredListings.length === 1 ? 'Result' : 'Results'} Found
          </Text>
          <TouchableOpacity style={tw`flex-row items-center gap-1.5`}>
            <Text style={[tw`text-[13px] font-medium`, { color: text }]}>{sortBy}</Text>
            <ChevronDown size={12} color={colors.gold} />
          </TouchableOpacity>
        </View>

        {/* Listings Grid */}
        <View style={tw`px-6 mt-6`}>
          {loading ? (
            <View style={tw`py-20 items-center`}>
              <Text style={[tw`text-sm`, { color: textMuted }]}>Loading...</Text>
            </View>
          ) : filteredListings.length === 0 ? (
            <View style={tw`py-20 items-center`}>
              <Text style={[tw`text-sm font-medium`, { color: textMuted }]}>No {typeLabel.toLowerCase()} found with current filters.</Text>
              <TouchableOpacity onPress={() => { setFilters(EMPTY_FILTERS); setSearchQuery(''); }} style={[tw`mt-3 px-4 py-2 rounded-full border`, { borderColor: '#e8e8e8' }]}>
                <Text style={tw`text-xs font-bold`}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={tw`gap-6`}>
              {filteredListings.map(listing => (
                <TouchableOpacity 
                  key={listing.id} 
                  style={[tw`rounded-[24px] overflow-hidden`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]} 
                  onPress={() => onListingClick(listing)}
                >
                  <View style={tw`relative h-56`}>
                    <OptimizedImage
                      src={listing.images[0]?.src ?? ''}
                      alt={listing.images[0]?.alt}
                      priority="normal"
                      resizeMode="cover"
                      style={tw`w-full h-full`}
                    />
                    {listing.isFeatured && (
                      <View style={[tw`absolute top-3 left-3 px-3 py-1.5 rounded-full`, { backgroundColor: colors.gold }]}>
                        <Text style={tw`text-white text-[10px] font-bold uppercase tracking-widest`}>Featured</Text>
                      </View>
                    )}
                    {listing.images.length > 1 && (
                      <View style={tw`absolute top-3 right-12 bg-black/50 px-2 py-1 rounded-full`}>
                        <Text style={tw`text-white text-[10px] font-bold`}>{listing.images.length}</Text>
                      </View>
                    )}
                    <TouchableOpacity style={tw`absolute top-3 right-3 p-2 bg-black/30 rounded-full`} onPress={() => Alert.alert('Saved', 'Item added to watchlist.')}>
                      <Heart size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View style={tw`p-5`}>
                    <View style={tw`flex-row justify-between items-start mb-3`}>
                      <View style={tw`flex-1 mr-3`}>
                        <Text style={[tw`font-bold text-lg mb-1`, { color: text }]} numberOfLines={1}>{listing.title}</Text>
                        <Text style={[tw`text-[11px] font-medium uppercase tracking-wider`, { color: textMuted }]}>{listing.location}</Text>
                      </View>
                      <Text style={[tw`font-bold text-lg`, { color: text }]}>{listing.currency}{listing.price.toLocaleString()}</Text>
                    </View>
                    
                    <View style={[tw`flex-row items-center gap-4 pt-4`, { borderTopWidth: 1, borderTopColor: border }]}>
                      {Object.entries(listing.specs).slice(0, 3).map(([k, v], i) => (
                        <View key={i} style={tw`flex-row items-center gap-1.5`}>
                          <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: colors.gold }]} />
                          <Text style={[tw`text-[11px] font-medium uppercase tracking-tight`, { color: textMuted }]}>{v}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {hasMore && !loading && (
                <View style={tw`items-center py-4`}>
                  <TouchableOpacity
                    style={[tw`px-6 py-2 rounded-full`, { backgroundColor: colors.gold }]}
                    onPress={async () => {
                      setLoading(true);
                      const nextPage = page + 1;
                      try {
                        const res = await getListingsByType(activeTab === 'car' ? 'car' : activeTab, PAGE_SIZE, nextPage);
                        if (res.success) {
                          setAllListings(prev => [...prev, ...(res.listings || [])]);
                          setHasMore((res.listings?.length || 0) >= PAGE_SIZE);
                          setPage(nextPage);
                        } else {
                          setHasMore(false);
                        }
                      } catch (err) {
                        console.warn('Load more failed', err);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <Text style={[tw`font-bold`, { color: '#000' }]}>Load more</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
