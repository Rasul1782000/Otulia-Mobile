import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Edit, Image as ImageIcon } from 'lucide-react-native';
import { messages, senders, listings } from '../data';
import { ViewState } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';

export function InboxView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('All Messages');
  const tabs = ['All Messages', 'Unread', 'Starred', 'Archive'];

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 pt-16 pb-8 flex-row justify-between items-end bg-white`}>
        <View>
          <View style={tw`flex-row items-center gap-2 mb-3`}>
            <Image 
              source={require('../images/assets/Otulia logo.jpeg')} 
              style={tw`w-14 h-14`}
              resizeMode="contain"
            />
            <Text style={tw`text-lg tracking-[10px] font-bold text-zinc-900 ml-1`}>OTULIA</Text>
          </View>
          <Text style={tw`text-4xl font-bold text-zinc-900`}>Inbox</Text>
        </View>
        <TouchableOpacity style={tw`p-2.5 bg-zinc-50 rounded-full border border-zinc-100 shadow-sm`} onPress={() => onViewChange('settings')}>
          <Edit size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={tw`px-6 mb-8`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-3`}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[
                  tw`px-5 py-2.5 rounded-full border shadow-sm`, 
                  isActive 
                    ? { backgroundColor: 'rgba(193,155,108,0.1)', borderColor: colors.gold } 
                    : tw`bg-zinc-50 border-zinc-100`
                ]}
              >
                <View style={tw`flex-row items-center gap-2`}>
                  <Text style={[tw`text-xs font-bold uppercase tracking-wider`, isActive ? { color: colors.gold } : tw`text-zinc-500`]}>
                    {tab}
                  </Text>
                  {tab === 'Unread' && (
                    <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: colors.gold }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Message List */}
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-32 px-4`}>
        {messages.map(msg => {
          const sender = senders[msg.senderId];
          const listing = msg.listingId ? listings.find(l => l.id === msg.listingId) : null;
          
          return (
            <TouchableOpacity 
              key={msg.id} 
              style={tw`p-4 mb-3 flex-row gap-4 bg-zinc-50 rounded-2xl border border-zinc-100 relative`}
              onPress={() => Alert.alert('Message Thread', `Opening conversation with ${sender?.name || 'User'}`)}
            >
              {msg.unread && (
                <View style={[tw`absolute left-3 top-1/2 -mt-1 w-2 h-2 rounded-full z-10`, { backgroundColor: colors.gold }]} />
              )}
              
              <View style={tw`w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-200`}>
                {sender?.avatar ? (
                  <Image source={{ uri: sender.avatar }} style={tw`w-full h-full`} />
                ) : (
                  <View style={tw`w-full h-full items-center justify-center bg-zinc-100`}>
                    <Text style={tw`text-xl font-bold`}>{sender?.name?.[0] || 'U'}</Text>
                  </View>
                )}
              </View>
              
              <View style={tw`flex-1 justify-center`}>
                <View style={tw`flex-row justify-between items-center mb-1`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Text style={[tw`text-sm font-bold`, msg.unread ? tw`text-zinc-900` : tw`text-zinc-600`]}>
                      {sender?.name}
                    </Text>
                    {msg.tag && (
                      <View style={[tw`px-1.5 py-0.5 rounded-md border`, { backgroundColor: 'rgba(193,155,108,0.05)', borderColor: 'rgba(193,155,108,0.2)' }]}>
                        <Text style={[tw`text-[8px] font-bold uppercase tracking-wider`, { color: colors.gold }]}>{msg.tag}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={tw`text-[10px] text-zinc-400 font-bold`}>{msg.timestamp}</Text>
                </View>
                
                <Text style={tw`text-xs font-bold text-zinc-800 mb-1`} numberOfLines={1}>
                  {listing ? `Inquiry: ${listing.title}` : 'General Inquiry'}
                </Text>
                
                <Text style={tw`text-[11px] text-zinc-500 pr-10 font-bold leading-4`} numberOfLines={2}>
                  {msg.snippet}
                </Text>
              </View>

              {listing && (
                <TouchableOpacity 
                  style={tw`w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100`}
                  onPress={() => {
                    const l = listings.find(lst => lst.id === msg.listingId);
                    if (l) onViewChange('detail');
                  }}
                >
                  <Image source={{ uri: listing.images[0] }} style={[tw`w-full h-full`, { opacity: 0.9 }]} />
                  {msg.unread && (
                    <View style={[tw`absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2 border-white`, { backgroundColor: colors.gold }]}>
                      <Text style={tw`text-[9px] font-bold text-white`}>2</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
