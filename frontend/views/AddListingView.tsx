import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, ImagePlus, Upload } from 'lucide-react-native';
import { ViewState } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';

export function AddListingView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const { isDark } = useTheme();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = () => {
    // In a real app, we would use expo-image-picker here
    console.log('Image upload clicked');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center justify-between px-6 py-4 pt-12 border-b border-zinc-100 bg-white`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity style={tw`mr-4`} onPress={() => onViewChange('home')}>
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-zinc-900`}>Create Listing</Text>
        </View>
        <Image 
          source={require('../images/assets/Otulia logo.jpeg')} 
          style={tw`w-10 h-10`}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-6 py-6 pb-32`}>
        <Text style={tw`text-xl font-bold text-zinc-900 mb-6`}>Upload Media</Text>
        
        <TouchableOpacity 
          style={tw`w-full h-56 border-2 border-dashed border-zinc-200 rounded-[28px] items-center justify-center bg-zinc-50 overflow-hidden mb-8 shadow-sm`}
          onPress={handleImageUpload}
        >
          {imagePreview ? (
            <Image source={{ uri: imagePreview }} style={tw`w-full h-full`} />
          ) : (
            <View style={tw`items-center`}>
              <View style={[tw`w-16 h-16 rounded-full items-center justify-center mb-4`, { backgroundColor: 'rgba(193,155,108,0.1)' }]}>
                <ImagePlus size={28} color={colors.gold} />
              </View>
              <Text style={tw`text-sm font-bold text-zinc-900`}>Select high-quality photos</Text>
              <Text style={tw`text-xs text-zinc-400 mt-1 font-bold`}>PNG, JPG or WEBP up to 10MB</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={tw`gap-6`}>
          <View>
            <Text style={tw`text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest`}>Item Title</Text>
            <TextInput 
              placeholder="e.g. 2024 Lamborghini Revuelto" 
              placeholderTextColor="#a1a1aa"
              style={tw`w-full border border-zinc-100 rounded-xl px-4 py-3 bg-zinc-50 text-sm text-zinc-900 font-bold`} 
            />
          </View>

          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest`}>Listing Price</Text>
              <TextInput 
                placeholder="0.00" 
                placeholderTextColor="#a1a1aa"
                keyboardType="numeric"
                style={tw`w-full border border-zinc-100 rounded-xl px-4 py-3 bg-zinc-50 text-sm text-zinc-900 font-bold`} 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest`}>Currency</Text>
              <View style={tw`border border-zinc-100 rounded-xl px-4 py-3 bg-zinc-100`}>
                 <Text style={tw`text-sm text-zinc-900 font-bold`}>EUR (€)</Text>
              </View>
            </View>
          </View>

          <View>
            <Text style={tw`text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest`}>Full Description</Text>
            <TextInput 
              placeholder="Provide a detailed description of the luxury item..." 
              placeholderTextColor="#a1a1aa"
              multiline 
              numberOfLines={6} 
              style={tw`w-full border border-zinc-100 rounded-xl px-4 py-3 bg-zinc-50 text-sm text-zinc-900 min-h-[120px] font-bold`} 
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[tw`w-full rounded-[20px] py-4 items-center mt-10 shadow-lg`, { backgroundColor: '#111113' }]}
          onPress={() => onViewChange('home')}
        >
          <Text style={tw`text-white text-sm font-bold uppercase tracking-widest`}>Publish Exclusive Listing</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
