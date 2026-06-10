import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, Heart, Share, Box, CheckCircle2, Calendar, Phone, MessageCircle, Smartphone } from 'lucide-react-native';
import { Listing, ViewState } from '../types';
import { colors } from '../theme';
import { ImageGalleryModal } from '../components/ImageGalleryModal';
import { openWhatsApp } from '../lib/whatsapp';
import tw from 'twrnc';

export function DetailView({ listing, onViewChange }: { listing: Listing, onViewChange: (v: ViewState) => void }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (!listing) return null;

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-32`}>
        {/* Header & Gallery */}
        <TouchableOpacity activeOpacity={1} style={tw`relative h-96 bg-black`} onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }}>
          <Image 
            source={{ uri: listing.images[0] }} 
            style={[tw`absolute inset-0 w-full h-full`, { opacity: 0.8 }]}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
          
          <View style={tw`relative z-10 flex-row justify-between items-center px-6 py-4 pt-12`}>
            <TouchableOpacity style={tw`bg-black/20 p-2 rounded-full`} onPress={() => onViewChange('explore')}>
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            
            <View style={tw`flex-col items-center`}>
              <Image 
                source={require('../images/assets/Otulia logo.jpeg')} 
                style={tw`w-10 h-10`}
                resizeMode="contain"
              />
              <Text style={tw`text-[10px] tracking-[4px] font-black text-white uppercase`}>Otulia</Text>
            </View>

            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity style={tw`p-2 bg-black/20 rounded-full`} onPress={() => Alert.alert('Saved', 'Item added to your watchlist.')}>
                <Heart size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={tw`p-2 bg-black/20 rounded-full`} onPress={() => Alert.alert('Share', 'Opening system share sheet...')}>
                <Share size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {listing.isFeatured && (
            <View style={tw`absolute top-24 left-6 z-10 bg-[#c19b6c] px-3 py-1 rounded`}>
              <Text style={tw`text-white text-[10px] font-black uppercase tracking-wider`}>FEATURED</Text>
            </View>
          )}

          <View style={tw`absolute bottom-4 left-6 bg-black/50 px-3 py-1 rounded-full z-10`}>
            <Text style={tw`text-white text-xs font-black`}>1/{listing.images.length}</Text>
          </View>
          <TouchableOpacity style={tw`absolute bottom-4 right-6 bg-black/50 p-2 rounded-full z-10`} onPress={() => Alert.alert('3D View', 'Loading immersive 3D model...')}>
            <Box size={16} color="white" />
          </TouchableOpacity>

          {/* Thumbnail Strip */}
          <View style={tw`absolute -bottom-10 left-0 w-full px-6 z-20`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2 pb-2`}>
              {listing.images.slice(0, 5).map((img, i) => (
                <TouchableOpacity key={i} style={tw`w-20 h-16 rounded-lg overflow-hidden border border-zinc-200 relative`} onPress={() => { setGalleryIndex(i); setGalleryVisible(true); }}>
                  <Image source={{ uri: img }} style={tw`w-full h-full`} />
                </TouchableOpacity>
              ))}
              {listing.images.length > 5 && (
                <TouchableOpacity style={tw`w-20 h-16 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-900 items-center justify-center`} onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }}>
                  <Text style={tw`text-white text-sm font-black`}>+{listing.images.length - 5}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>

        <View style={tw`px-6 pt-16`}>
          {/* Title & Price */}
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Text style={tw`text-2xl font-black text-zinc-900`}>{listing.title}</Text>
                <CheckCircle2 size={20} color="#3b82f6" />
              </View>
              <Text style={tw`text-sm text-zinc-600 mt-1 font-black`}>{listing.location}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-2xl font-black text-zinc-900`}>{listing.currency}{listing.price.toLocaleString()}</Text>
              {listing.type === 'estate' && <Text style={tw`text-xs text-zinc-600 mt-1 font-black`}>€9,668 / m²</Text>}
            </View>
          </View>

          {/* Actions row */}
          <View style={tw`flex-row gap-2 mt-6`}>
            <TouchableOpacity 
              style={[tw`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2`, { backgroundColor: 'rgba(193,155,108,0.1)' }]}
              onPress={() => Alert.alert(listing.type === 'car' ? 'Book Drive' : 'Schedule Viewing', `Requesting appointment for ${listing.title}...`)}
            >
              <Calendar size={16} color={colors.gold} />
              <Text style={[tw`text-sm font-black`, { color: colors.gold }]}>{listing.type === 'car' ? 'Book Drive' : 'Schedule'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 bg-zinc-50 py-3 rounded-xl flex-row items-center justify-center gap-2 border border-zinc-100`}
              onPress={() => Alert.alert('Contact Dealer', 'Initiating secure phone call...')}
            >
              <Phone size={16} color="#4b5563" />
              <Text style={tw`text-sm font-black text-zinc-800`}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 bg-zinc-50 py-3 rounded-xl flex-row items-center justify-center gap-2 border border-zinc-100`}
              onPress={() => onViewChange('inbox')}
            >
              <MessageCircle size={16} color="#4b5563" />
              <Text style={tw`text-sm font-black text-zinc-800`}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[tw`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 border`, { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' }]}
              onPress={() => openWhatsApp(`Hi, I'm interested in ${listing.title} (${listing.currency}${listing.price.toLocaleString()}).`)}
            >
              <Smartphone size={16} color="#166534" />
              <Text style={tw`text-sm font-black text-green-800`}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`px-6 mt-6 border-b border-zinc-100`} contentContainerStyle={tw`gap-6`}>
          {['Overview', listing.type === 'car' ? 'Specs' : 'Details', 'Features', 'Gallery', 'Location'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[tw`pb-3 border-b-2`, activeTab === tab ? { borderBottomColor: colors.gold } : { borderBottomColor: 'transparent' }]}
            >
              <Text style={[tw`text-sm font-black`, activeTab === tab ? { color: colors.gold } : { color: '#4b5563' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={tw`px-6 mt-6`}>
          <Text style={tw`text-lg font-black mb-3 text-zinc-900`}>About this {listing.type === 'estate' ? 'property' : 'car'}</Text>
          <Text style={tw`text-sm text-zinc-700 leading-5 mb-8 font-black`}>
            The {listing.title} represents the pinnacle of luxury and performance. A meticulously crafted masterpiece delivering extreme power with next-gen technology and unmatched dynamics.
          </Text>

          {/* Specs Grid */}
          <View style={tw`flex-row flex-wrap gap-2 mb-8`}>
            {Object.entries(listing.specs).map(([k, v], i) => (
              <TouchableOpacity key={i} style={tw`w-[48%] bg-zinc-50 p-4 rounded-xl border border-zinc-100 items-center justify-center`} onPress={() => Alert.alert(k, v)}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-zinc-600 mb-1 font-black`}>{k}</Text>
                <Text style={tw`text-sm font-black text-zinc-900`}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dealer Card */}
          <TouchableOpacity style={tw`bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex-row items-center justify-between mb-8`} onPress={() => Alert.alert('Dealer Profile', 'Opening dealer boutique page...')}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={[tw`w-12 h-12 rounded-full border overflow-hidden`, { borderColor: colors.gold }]}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=128" }} style={tw`w-full h-full`} />
              </View>
              <View>
                <View style={tw`flex-row items-center gap-1`}>
                  <Text style={tw`font-black text-sm text-zinc-900`}>Luxury Motors GmbH</Text>
                  <CheckCircle2 size={12} color={colors.gold} />
                </View>
                <Text style={tw`text-xs text-zinc-600 mt-0.5 font-black`}>Verified Dealer • 4.8 ★</Text>
              </View>
            </View>
            <View style={tw`flex-row gap-2`}>
              <TouchableOpacity style={tw`w-8 h-8 rounded-full border border-zinc-200 items-center justify-center`} onPress={() => Alert.alert('Call', 'Connecting to dealer...')}>
                <Phone size={14} color="#71717a"/>
              </TouchableOpacity>
              <TouchableOpacity style={tw`w-8 h-8 rounded-full border border-zinc-200 items-center justify-center`} onPress={() => onViewChange('inbox')}>
                <MessageCircle size={14} color="#71717a"/>
              </TouchableOpacity>
              <TouchableOpacity style={tw`w-8 h-8 rounded-full border border-green-200 items-center justify-center bg-green-50`} onPress={() => openWhatsApp(`Hi, I'm interested in ${listing.title}.`)}>
                <Smartphone size={14} color="#166534"/>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-4 px-6 flex-row justify-between items-center z-50`}>
        <View>
          <Text style={tw`text-lg font-black text-zinc-900`}>{listing.currency}{listing.price.toLocaleString()}</Text>
          <View style={tw`flex-row items-center gap-1`}>
            <View style={tw`w-2 h-2 rounded-full bg-green-500`} />
            <Text style={tw`text-xs text-zinc-600 font-black`}>Fair Price</Text>
          </View>
        </View>
        <View style={tw`flex-row gap-3`}>
          <TouchableOpacity 
            style={[tw`px-4 py-3 rounded-lg border`, { borderColor: colors.gold }]}
            onPress={() => Alert.alert('Make Offer', 'Opening offer negotiation tool...')}
          >
            <Text style={[tw`font-black text-sm`, { color: colors.gold }]}>Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[tw`px-6 py-3 rounded-lg`, { backgroundColor: colors.gold }]}
            onPress={() => Alert.alert('Purchase', `Processing transaction for ${listing.title}...`)}
          >
            <Text style={tw`text-white font-black text-sm`}>{listing.type === 'car' ? 'Buy Now' : 'Info'}</Text>
          </TouchableOpacity>
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
