import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Search } from 'lucide-react-native';
import { useTheme, colors } from '../theme';
import { Listing } from '../types';
import { OptimizedImage } from './OptimizedImage';
import tw from 'twrnc';

interface ListingCardProps {
  listing: Listing;
  onPress: (listing: Listing) => void;
  variant?: 'horizontal' | 'vertical';
}

export const ListingCard = memo(function ListingCard({ listing, onPress, variant = 'vertical' }: ListingCardProps) {
  const { isDark } = useTheme();
  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;
  const firstImage = listing.images?.[0] ?? null;

  return (
    <TouchableOpacity
      onPress={() => onPress(listing)}
      style={[
        tw`overflow-hidden`,
        { backgroundColor: surface, borderWidth: 1, borderColor: border },
        variant === 'horizontal' ? tw`w-[280px] rounded-[28px]` : tw`rounded-[32px]`,
      ]}
      activeOpacity={0.95}
    >
      <View style={tw`relative ${variant === 'horizontal' ? 'h-44' : 'h-60'}`}>
        <OptimizedImage
          src={firstImage?.src ?? ''}
          alt={firstImage?.alt}
          priority="normal"
          resizeMode="cover"
          style={tw`w-full h-full`}
        />

        {listing.isFeatured ? (
          <View style={[tw`absolute top-3 left-3 px-3 py-1 rounded-full`, { backgroundColor: colors.gold }]}>
            <Text style={tw`text-white text-[10px] font-black uppercase tracking-widest`}>Exclusive</Text>
          </View>
        ) : (
          <View style={tw`absolute top-3 left-3 bg-black/40 px-3 py-1 rounded-full`}>
            <Text style={tw`text-white text-[10px] font-black uppercase tracking-widest`}>{listing.type}</Text>
          </View>
        )}

        {listing.images.length > 1 && (
          <View style={tw`absolute top-3 right-14 bg-black/50 px-2 py-1 rounded-full`}>
            <Text style={tw`text-white text-[10px] font-black`}>{listing.images.length}</Text>
          </View>
        )}

        <TouchableOpacity style={tw`absolute top-3 right-3 p-2 bg-black/30 rounded-full`}>
          <Heart size={variant === 'horizontal' ? 18 : 20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={tw`${variant === 'horizontal' ? 'p-5' : 'p-6'}`}>
        <Text
          style={[tw`font-black mb-1 ${variant === 'horizontal' ? 'text-base' : 'text-xl'}`, { color: text }]}
          numberOfLines={1}
        >
          {listing.title}
        </Text>

        <View style={tw`flex-row items-center gap-1.5 mb-4`}>
          <Search size={10} color={colors.gold} />
          <Text style={[tw`text-[11px] font-black uppercase tracking-wider`, { color: textMuted }]}>{listing.location}</Text>
        </View>

        {variant === 'vertical' && Object.keys(listing.specs).length > 0 && (
          <View style={[tw`flex-row items-center gap-5 pt-5 mb-4`, { borderTopWidth: 1, borderTopColor: border }]}>
            {Object.entries(listing.specs).slice(0, 3).map(([k, v], i) => (
              <View key={i} style={tw`flex-row items-center gap-1.5`}>
                <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: colors.gold }]} />
                <Text style={[tw`text-[11px] font-black uppercase tracking-tight`, { color: textMuted }]}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[tw`flex-row items-center justify-between pt-4`, { borderTopWidth: 1, borderTopColor: border }]}>
          <Text style={[tw`font-black ${variant === 'horizontal' ? 'text-lg' : 'text-xl'}`, { color: text }]}>
            {listing.currency}{listing.price.toLocaleString()}
          </Text>
          <View style={[tw`px-3 py-1 rounded-lg`, { backgroundColor: colors.goldLight }]}>
            <Text style={[tw`text-[10px] font-black uppercase tracking-wider`, { color: colors.gold }]}>Details</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});
