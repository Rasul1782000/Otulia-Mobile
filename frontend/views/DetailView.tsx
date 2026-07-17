import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, Heart, Share, Box, CheckCircle2, Calendar, Phone, MessageCircle, Smartphone } from 'lucide-react-native';
import { Listing, ViewState } from '../types';
import { useTheme, colors } from '../theme';
import { ImageGalleryModal } from '../components/ImageGalleryModal';
import { OptimizedImage } from '../components/OptimizedImage';
import { openWhatsApp } from '../lib/whatsapp';
import { getThumbnailUrl } from '../lib/images';
import tw from 'twrnc';

export function DetailView({ listing, onViewChange }: { listing: Listing, onViewChange: (v: ViewState) => void }) {
  const { isDark } = useTheme();
  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  const [activeTab, setActiveTab] = useState('Overview');
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (!listing) return null;

  const tabs = ['Overview', listing.type === 'car' ? 'Specs' : 'Details', 'Features', 'Gallery', 'Location'];

  return (
    <View style={[tw`flex-1`, { backgroundColor: bg }]}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-28`}>
        {/* Hero Image */}
        <TouchableOpacity activeOpacity={1} style={tw`relative h-80 bg-black`} onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }}>
          <OptimizedImage
            src={listing.images[0]?.src ?? ''}
            alt={listing.images[0]?.alt}
            priority="high"
            resizeMode="cover"
            style={[tw`absolute inset-0 w-full h-full`, { opacity: 0.85 }]}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />

          {/* Top Bar */}
          <View style={tw`relative z-10 flex-row justify-between items-center px-5 pt-12`}>
            <TouchableOpacity style={tw`w-10 h-10 bg-black/30 rounded-full items-center justify-center`} onPress={() => onViewChange('explore')}>
              <ArrowLeft size={18} color="white" />
            </TouchableOpacity>
            <View style={tw`flex-row gap-2`}>
              <TouchableOpacity style={tw`w-10 h-10 bg-black/30 rounded-full items-center justify-center`} onPress={() => Alert.alert('Saved', 'Item added to your watchlist.')}>
                <Heart size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`w-10 h-10 bg-black/30 rounded-full items-center justify-center`} onPress={() => Alert.alert('Share', 'Opening system share sheet...')}>
                <Share size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Badge */}
          {listing.isFeatured && (
            <View style={[tw`absolute top-28 left-5 z-10 px-3 py-1.5 rounded-md`, { backgroundColor: colors.gold }]}>
              <Text style={tw`text-white text-[10px] font-black uppercase tracking-wider`}>Featured</Text>
            </View>
          )}

          {/* Bottom Info */}
          <View style={tw`absolute bottom-20 left-5 right-5 z-10`}>
            <Text style={tw`text-white text-3xl font-black mb-1`}>{listing.title}</Text>
            <View style={tw`flex-row items-center gap-1.5`}>
              <Text style={tw`text-white/80 text-sm font-bold`}>{listing.location}</Text>
            </View>
          </View>

          {/* Image Counter & 3D */}
          <View style={tw`absolute bottom-5 left-5 right-5 z-10 flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center gap-2`}>
              {listing.images.slice(0, 4).map((img, i) => (
                <TouchableOpacity key={i} style={tw`w-12 h-9 rounded-md overflow-hidden border-2 border-white/40`} onPress={() => { setGalleryIndex(i); setGalleryVisible(true); }}>
                  <OptimizedImage
                    src={getThumbnailUrl(img.src, 48)}
                    alt={img.alt}
                    priority="low"
                    resizeMode="cover"
                    style={tw`w-full h-full`}
                    showPlaceholder={false}
                  />
                </TouchableOpacity>
              ))}
              {listing.images.length > 4 && (
                <TouchableOpacity style={tw`w-12 h-9 rounded-md overflow-hidden bg-black/50 items-center justify-center border-2 border-white/40`} onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }}>
                  <Text style={tw`text-white text-[10px] font-black`}>+{listing.images.length - 4}</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={tw`w-10 h-10 bg-black/40 rounded-full items-center justify-center`} onPress={() => Alert.alert('3D View', 'Loading immersive 3D model...')}>
              <Box size={16} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={tw`px-5 mt-5`}>
          {/* Title & Price */}
          <View style={tw`flex-row justify-between items-start mb-1`}>
            <View style={tw`flex-1 mr-4`}>
              <View style={tw`flex-row items-center gap-1.5 mb-1`}>
                <Text style={[tw`text-xl font-black`, { color: text }]} numberOfLines={1}>{listing.title}</Text>
                <CheckCircle2 size={16} color={colors.gold} />
              </View>
              <Text style={[tw`text-xs font-bold`, { color: textMuted }]}>{listing.location}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={[tw`text-xl font-black`, { color: text }]}>{listing.currency}{listing.price.toLocaleString()}</Text>
              {listing.type === 'estate' && <Text style={[tw`text-[10px] font-bold mt-0.5`, { color: textMuted }]}>Price / m² available</Text>}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row gap-2.5 mt-5`}>
            <TouchableOpacity 
              style={[tw`flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-1.5`, { backgroundColor: colors.gold }]}
              onPress={() => Alert.alert(listing.type === 'car' ? 'Book Drive' : 'Schedule Viewing', `Requesting appointment for ${listing.title}...`)}
            >
              <Calendar size={14} color="white" />
              <Text style={tw`text-xs font-black text-white`}>{listing.type === 'car' ? 'Book Drive' : 'Schedule'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[tw`flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-1.5`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]}
              onPress={() => Alert.alert('Contact Dealer', 'Initiating secure phone call...')}
            >
              <Phone size={14} color={textMuted} />
              <Text style={[tw`text-xs font-black`, { color: text }]}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[tw`flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-1.5`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]}
              onPress={() => onViewChange('inbox')}
            >
              <MessageCircle size={14} color={textMuted} />
              <Text style={[tw`text-xs font-black`, { color: text }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 bg-green-50 border border-green-100`}
              onPress={() => openWhatsApp(`Hi, I'm interested in ${listing.title} (${listing.currency}${listing.price.toLocaleString()}).`)}
            >
              <Smartphone size={14} color="#166534" />
              <Text style={tw`text-xs font-black text-green-800`}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={[tw`flex-row mt-7`, { borderBottomWidth: 1, borderBottomColor: border }]}>
            {tabs.map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[tw`pb-3 mr-6 border-b-2`, activeTab === tab ? { borderBottomColor: colors.gold } : { borderBottomColor: 'transparent' }]}
              >
                <Text style={[tw`text-sm font-bold`, activeTab === tab ? { color: colors.gold } : { color: textMuted }]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={tw`mt-6 mb-6`}>
            <Text style={[tw`text-base font-black mb-3`, { color: text }]}>About this {listing.type === 'estate' ? 'property' : 'vehicle'}</Text>
            <Text style={[tw`text-sm leading-6 font-normal`, { color: textMuted }]}>
              The {listing.title} represents the pinnacle of luxury and performance. A meticulously crafted masterpiece delivering extreme power with next-generation technology and unmatched dynamics.
            </Text>
          </View>

          {/* Specs Grid */}
          <View style={tw`flex-row flex-wrap gap-2.5 mb-6`}>
            {Object.entries(listing.specs).map(([k, v], i) => (
              <View key={i} style={[tw`w-[47%] py-4 px-4 rounded-xl`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]}>
                <Text style={[tw`text-[10px] uppercase tracking-widest mb-1 font-bold`, { color: textMuted }]}>{k}</Text>
                <Text style={[tw`text-sm font-black`, { color: text }]}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Dealer Card */}
          <View style={[tw`p-4 rounded-2xl mb-4`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={[tw`w-11 h-11 rounded-full items-center justify-center`, { backgroundColor: colors.goldLight }]}>
                  <Text style={[tw`text-sm font-black`, { color: colors.gold }]}>{listing.dealerId ? listing.dealerId.charAt(0).toUpperCase() : 'D'}</Text>
                </View>
                <View>
                  <View style={tw`flex-row items-center gap-1`}>
                    <Text style={[tw`font-black text-sm`, { color: text }]}>Dealer</Text>
                    <CheckCircle2 size={12} color={colors.gold} />
                  </View>
                  <Text style={[tw`text-[11px] font-bold`, { color: textMuted }]}>Verified Seller</Text>
                </View>
              </View>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity style={[tw`w-9 h-9 rounded-full items-center justify-center`, { backgroundColor: bg, borderWidth: 1, borderColor: border }]} onPress={() => Alert.alert('Call', 'Connecting to dealer...')}>
                  <Phone size={14} color={textMuted}/>
                </TouchableOpacity>
                <TouchableOpacity style={[tw`w-9 h-9 rounded-full items-center justify-center`, { backgroundColor: bg, borderWidth: 1, borderColor: border }]} onPress={() => onViewChange('inbox')}>
                  <MessageCircle size={14} color={textMuted}/>
                </TouchableOpacity>
                <TouchableOpacity style={tw`w-9 h-9 rounded-full items-center justify-center bg-green-50 border border-green-100`} onPress={() => openWhatsApp(`Hi, I'm interested in ${listing.title}.`)}>
                  <Smartphone size={14} color="#166534"/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[tw`absolute bottom-0 left-0 right-0 px-5 pt-3 pb-6 z-50`, { backgroundColor: bg, borderTopWidth: 1, borderTopColor: border }]}>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={[tw`text-lg font-black`, { color: text }]}>{listing.currency}{listing.price.toLocaleString()}</Text>
            <View style={tw`flex-row items-center gap-1.5 mt-0.5`}>
              <View style={tw`w-1.5 h-1.5 rounded-full bg-green-500`} />
              <Text style={[tw`text-[10px] font-bold`, { color: textMuted }]}>Fair Price</Text>
            </View>
          </View>
          <View style={tw`flex-row gap-2.5`}>
            <TouchableOpacity 
              style={[tw`px-5 py-3 rounded-xl border`, { borderColor: colors.gold }]}
              onPress={() => Alert.alert('Make Offer', 'Opening offer negotiation tool...')}
            >
              <Text style={[tw`font-black text-sm`, { color: colors.gold }]}>Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[tw`px-6 py-3 rounded-xl`, { backgroundColor: colors.gold }]}
              onPress={() => Alert.alert('Purchase', `Processing transaction for ${listing.title}...`)}
            >
              <Text style={tw`text-white font-black text-sm`}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ImageGalleryModal
        visible={galleryVisible}
        images={listing.images}
        initialIndex={galleryIndex}
        onClose={() => setGalleryVisible(false)}
      />
    </View>
  );
}
