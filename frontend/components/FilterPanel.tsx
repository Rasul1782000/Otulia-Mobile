import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { ChevronDown, X, SlidersHorizontal, Search } from 'lucide-react-native';
import { Listing } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';

export interface FilterState {
  brand: string | null;
  year: string | null;
  fuel: string | null;
  mileage: string | null;
  propertyType: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  priceRange: string | null;
  bikeType: string | null;
  yachtType: string | null;
  yachtLength: string | null;
  jetType: string | null;
  jetRange: string | null;
  model: string | null;
  location: string | null;
}

export const EMPTY_FILTERS: FilterState = {
  brand: null, year: null, fuel: null, mileage: null,
  propertyType: null, bedrooms: null, bathrooms: null, priceRange: null,
  bikeType: null, yachtType: null, yachtLength: null,
  jetType: null, jetRange: null, model: null, location: null,
};

interface FilterOption {
  label: string;
  value: string;
}

interface PillDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

function PillDropdown({ label, options, selected, onSelect }: PillDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<View>(null);
  const hasValue = selected !== null && selected !== '';

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    return () => {};
  }, [open]);

  return (
    <>
      <TouchableOpacity
        ref={ref}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={[
          tw`flex-row items-center gap-1.5 rounded-full border`,
          tw`px-3.5 py-2.5`,
          hasValue
            ? { backgroundColor: '#f7f7f7', borderColor: '#e8e8e8' }
            : { backgroundColor: '#ffffff', borderColor: '#e8e8e8' },
        ]}
      >
        <Text
          style={[
            tw`text-[13px] font-medium`,
            { color: hasValue ? '#1a1a1a' : '#999999', fontFamily: 'Inter, sans-serif' },
          ]}
          numberOfLines={1}
        >
          {selected || label}
        </Text>
        <ChevronDown size={12} color={hasValue ? '#1a1a1a' : '#999999'} />
      </TouchableOpacity>

      {open && (
        <>
          <Pressable style={tw`absolute inset-0 z-40`} onPress={() => setOpen(false)} />
          <View style={[tw`absolute top-full left-0 mt-2 z-50 min-w-[170px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden`]}>
            <TouchableOpacity
              onPress={() => { onSelect(null); setOpen(false); }}
              style={[tw`px-4 py-3`, { backgroundColor: !selected ? '#fdf8f0' : 'transparent' }]}
            >
              <Text style={[tw`text-[13px]`, { color: !selected ? '#b18b24' : '#666666', fontWeight: !selected ? '600' : '400' }]}>
                Any {label}
              </Text>
            </TouchableOpacity>
            <ScrollView style={tw`max-h-[220px]`} showsVerticalScrollIndicator={false}>
              {options.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => { onSelect(opt.value); setOpen(false); }}
                  style={[tw`px-4 py-3`, { backgroundColor: selected === opt.value ? '#fdf8f0' : 'transparent' }]}
                >
                  <Text style={[tw`text-[13px]`, {
                    color: selected === opt.value ? '#b18b24' : '#333333',
                    fontWeight: selected === opt.value ? '600' : '400',
                  }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
}

const CAR_YEARS: FilterOption[] = [
  { label: '2024+', value: '2024' },
  { label: '2022-2023', value: '2022' },
  { label: '2020-2021', value: '2020' },
  { label: '2018-2019', value: '2018' },
  { label: 'Before 2018', value: '2017' },
];

const CAR_FUELS: FilterOption[] = [
  { label: 'Gasoline', value: 'Gasoline' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Electric', value: 'Electric' },
  { label: 'Hybrid', value: 'Hybrid' },
];

const CAR_MILEAGE: FilterOption[] = [
  { label: 'Under 10k km', value: '0-10000' },
  { label: '10k-50k km', value: '10000-50000' },
  { label: '50k-100k km', value: '50000-100000' },
  { label: 'Over 100k km', value: '100000-999999' },
];

const ESTATE_TYPES: FilterOption[] = [
  { label: 'Villa', value: 'Villa' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Mansion', value: 'Mansion' },
  { label: 'Estate', value: 'Estate' },
];

const ESTATE_BEDROOMS: FilterOption[] = [
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

const ESTATE_BATHROOMS: FilterOption[] = [
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
];

const PRICE_RANGES: FilterOption[] = [
  { label: '$50K - $100K', value: '50000-100000' },
  { label: '$100K - $200K', value: '100000-200000' },
  { label: '$200K - $400K', value: '200000-400000' },
  { label: '$400K - $750K', value: '400000-750000' },
  { label: '$750K - $1.5M', value: '750000-1500000' },
  { label: '$1.5M - $3M', value: '1500000-3000000' },
  { label: '$3M+', value: '3000000-999999999' },
];

const BIKE_TYPES: FilterOption[] = [
  { label: 'Sport', value: 'Sport' },
  { label: 'Cruiser', value: 'Cruiser' },
  { label: 'Touring', value: 'Touring' },
  { label: 'Adventure', value: 'Adventure' },
  { label: 'Naked', value: 'Naked' },
];

const YACHT_TYPES: FilterOption[] = [
  { label: 'Motor Yacht', value: 'Motor Yacht' },
  { label: 'Sailing Yacht', value: 'Sailing Yacht' },
  { label: 'Catamaran', value: 'Catamaran' },
  { label: 'Superyacht', value: 'Superyacht' },
];

const YACHT_LENGTHS: FilterOption[] = [
  { label: 'Under 40ft', value: '0-40' },
  { label: '40-60ft', value: '40-60' },
  { label: '60-100ft', value: '60-100' },
  { label: '100ft+', value: '100-999' },
];

const JET_TYPES: FilterOption[] = [
  { label: 'Light Jet', value: 'Light Jet' },
  { label: 'Midsize Jet', value: 'Midsize Jet' },
  { label: 'Heavy Jet', value: 'Heavy Jet' },
  { label: 'Ultra Long Range', value: 'Ultra Long Range' },
];

const JET_RANGES: FilterOption[] = [
  { label: 'Under 2,000nm', value: '0-2000' },
  { label: '2,000-4,000nm', value: '2000-4000' },
  { label: '4,000-6,000nm', value: '4000-6000' },
  { label: '6,000nm+', value: '6000-99999' },
];

interface FilterPanelProps {
  activeType: Listing['type'];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  brands: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearch: () => void;
}

export function FilterPanel({ activeType, filters, onFiltersChange, brands, searchQuery, onSearchChange, onSearch }: FilterPanelProps) {
  const brandOptions: FilterOption[] = brands.map(b => ({ label: b, value: b }));

  const activeFilterCount = Object.values(filters).filter(v => v !== null).length;

  const clearAll = () => onFiltersChange(EMPTY_FILTERS);

  const updateFilter = (key: keyof FilterState, value: string | null) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <View style={tw`w-full items-center px-4`}>
      {/* Filter Bar - Pill Shape */}
      <View style={[
        tw`w-full max-w-[1200px] flex-row items-center rounded-[24px] border border-gray-200 p-2`,
        { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      ]}>
        {/* Filters Label */}
        <View style={tw`bg-black rounded-full px-4 py-2.5 mr-1`}>
          <Text style={tw`text-white text-[11px] font-bold uppercase tracking-widest`}>
            {activeFilterCount > 0 ? `Filters ${activeFilterCount}` : 'Filters'}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-1.5 flex-1`} style={tw`flex-1`}>
          {activeType === 'car' && (
            <>
              <PillDropdown label="Category" options={brandOptions} selected={filters.brand} onSelect={v => updateFilter('brand', v)} />
              <PillDropdown label="Brand" options={brandOptions} selected={filters.brand} onSelect={v => updateFilter('brand', v)} />
              <PillDropdown label="Model" options={[]} selected={filters.model} onSelect={v => updateFilter('model', v)} />
              <PillDropdown label="Year" options={CAR_YEARS} selected={filters.year} onSelect={v => updateFilter('year', v)} />
              <PillDropdown label="Fuel" options={CAR_FUELS} selected={filters.fuel} onSelect={v => updateFilter('fuel', v)} />
              <PillDropdown label="Price" options={PRICE_RANGES} selected={filters.priceRange} onSelect={v => updateFilter('priceRange', v)} />
            </>
          )}
          {activeType === 'estate' && (
            <>
              <PillDropdown label="Type" options={ESTATE_TYPES} selected={filters.propertyType} onSelect={v => updateFilter('propertyType', v)} />
              <PillDropdown label="Bedrooms" options={ESTATE_BEDROOMS} selected={filters.bedrooms} onSelect={v => updateFilter('bedrooms', v)} />
              <PillDropdown label="Bathrooms" options={ESTATE_BATHROOMS} selected={filters.bathrooms} onSelect={v => updateFilter('bathrooms', v)} />
              <PillDropdown label="Price" options={PRICE_RANGES} selected={filters.priceRange} onSelect={v => updateFilter('priceRange', v)} />
            </>
          )}
          {activeType === 'bike' && (
            <>
              <PillDropdown label="Brand" options={brandOptions} selected={filters.brand} onSelect={v => updateFilter('brand', v)} />
              <PillDropdown label="Type" options={BIKE_TYPES} selected={filters.bikeType} onSelect={v => updateFilter('bikeType', v)} />
              <PillDropdown label="Price" options={PRICE_RANGES} selected={filters.priceRange} onSelect={v => updateFilter('priceRange', v)} />
            </>
          )}
          {activeType === 'yacht' && (
            <>
              <PillDropdown label="Brand" options={brandOptions} selected={filters.brand} onSelect={v => updateFilter('brand', v)} />
              <PillDropdown label="Type" options={YACHT_TYPES} selected={filters.yachtType} onSelect={v => updateFilter('yachtType', v)} />
              <PillDropdown label="Length" options={YACHT_LENGTHS} selected={filters.yachtLength} onSelect={v => updateFilter('yachtLength', v)} />
              <PillDropdown label="Price" options={PRICE_RANGES} selected={filters.priceRange} onSelect={v => updateFilter('priceRange', v)} />
            </>
          )}
          {activeType === 'jet' && (
            <>
              <PillDropdown label="Brand" options={brandOptions} selected={filters.brand} onSelect={v => updateFilter('brand', v)} />
              <PillDropdown label="Type" options={JET_TYPES} selected={filters.jetType} onSelect={v => updateFilter('jetType', v)} />
              <PillDropdown label="Range" options={JET_RANGES} selected={filters.jetRange} onSelect={v => updateFilter('jetRange', v)} />
              <PillDropdown label="Price" options={PRICE_RANGES} selected={filters.priceRange} onSelect={v => updateFilter('priceRange', v)} />
            </>
          )}
        </ScrollView>

        {/* Search Button */}
        <TouchableOpacity
          onPress={onSearch}
          style={tw`bg-black rounded-full px-5 py-2.5 ml-1 flex-row items-center gap-2`}
          activeOpacity={0.8}
        >
          <Search size={14} color="white" />
          <Text style={tw`text-white text-[11px] font-bold uppercase tracking-widest`}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <View style={tw`w-full max-w-[1200px] flex-row items-center gap-2 mt-3 px-2`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2`}>
            <TouchableOpacity
              onPress={clearAll}
              style={[tw`flex-row items-center gap-1 px-3 py-1.5 rounded-full border`, { borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }]}
            >
              <X size={10} color="#ef4444" />
              <Text style={tw`text-[10px] font-bold uppercase tracking-wider text-red-500`}>Clear All</Text>
            </TouchableOpacity>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              const labels: Record<string, string> = {
                brand: 'Brand', year: 'Year', fuel: 'Fuel', mileage: 'Mileage',
                propertyType: 'Type', bedrooms: 'Beds', bathrooms: 'Baths',
                priceRange: 'Price', bikeType: 'Type', yachtType: 'Type',
                yachtLength: 'Length', jetType: 'Type', jetRange: 'Range', model: 'Model', location: 'Location',
              };
              return (
                <View
                  key={key}
                  style={[tw`flex-row items-center gap-1 px-3 py-1.5 rounded-full`, { backgroundColor: 'rgba(177,139,36,0.12)' }]}
                >
                  <Text style={[tw`text-[10px] font-bold uppercase tracking-wider`, { color: '#b18b24' }]} numberOfLines={1}>
                    {labels[key] || key}: {value}
                  </Text>
                  <TouchableOpacity onPress={() => updateFilter(key as keyof FilterState, null)}>
                    <X size={10} color="#b18b24" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
