import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Settings, Edit2, Heart, Bell, Eye, Calendar, FileText, Search, Shield, User as UserIcon, HelpCircle, LogOut, ChevronRight, CheckCircle2, Home, DollarSign, Bed, MessageCircle } from 'lucide-react-native';
import { currentUser } from '../data';
import { useTheme, colors } from '../theme';
import { ViewState } from '../types';
import tw from 'twrnc';

export function ProfileView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-32`}>
        {/* Header Background */}
        <View style={tw`h-48 w-full bg-zinc-50 relative`}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1613490900233-ea41ddbc05d0?auto=format&fit=crop&q=80&w=1200" }} 
            style={tw`w-full h-full opacity-40`} 
          />
          <View style={tw`absolute top-12 right-6`}>
            <TouchableOpacity style={tw`p-2.5 bg-white rounded-full shadow-sm border border-zinc-100`} onPress={() => onViewChange('settings')}>
              <Settings size={20} color="#18181b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Section */}
        <View style={tw`px-6 -mt-16`}>
          <View style={tw`flex-row items-end gap-5 mb-6`}>
            <View style={tw`relative`}>
              <TouchableOpacity 
                style={tw`w-28 h-28 rounded-[32px] border-4 border-white overflow-hidden shadow-xl bg-zinc-100`}
                onPress={() => Alert.alert('Edit Avatar', 'Opening image picker...')}
              >
                <Image source={{ uri: currentUser.avatar }} style={tw`w-full h-full`} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[tw`absolute -bottom-2 -right-2 w-10 h-10 rounded-full items-center justify-center border-4 border-white shadow-md`, { backgroundColor: colors.gold }]}
                onPress={() => Alert.alert('Edit Profile', 'Opening profile editor...')}
              >
                <Edit2 size={14} color="white" />
              </TouchableOpacity>
            </View>
            <View style={tw`flex-1 pb-2`}>
              <View style={tw`flex-row items-center gap-1.5 mb-1`}>
                <Text style={tw`text-2xl font-bold text-zinc-900`}>{currentUser.name}</Text>
                <CheckCircle2 size={16} color={colors.gold} />
              </View>
              <Text style={tw`text-sm font-bold text-zinc-400 mb-2`}>{currentUser.email}</Text>
              <View style={[tw`self-start px-3 py-1 rounded-lg border`, { backgroundColor: 'rgba(193,155,108,0.05)', borderColor: 'rgba(193,155,108,0.1)' }]}>
                <Text style={[tw`text-[10px] font-bold uppercase tracking-widest`, { color: colors.gold }]}>Platinum Member</Text>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={tw`flex-row justify-between py-6 border-t border-b border-zinc-50 mb-8`}>
            {[
              { label: 'Saved', value: '28' },
              { label: 'Alerts', value: '14' },
              { label: 'Offers', value: '3' }
            ].map((stat, i) => (
              <TouchableOpacity key={i} style={tw`items-start flex-1`} onPress={() => Alert.alert(stat.label, `Viewing your ${stat.label.toLowerCase()} history...`)}>
                <Text style={tw`text-xl font-bold text-zinc-900 mb-0.5`}>{stat.value}</Text>
                <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Sections */}
          <View style={tw`gap-10`}>
            <View>
              <Text style={tw`text-[11px] font-bold text-zinc-400 uppercase tracking-[3px] mb-4`}>Marketplace Activity</Text>
              <View style={tw`gap-1`}>
                {[
                  { icon: MessageCircle, title: 'Inquiries', desc: 'Manage your active conversations', target: 'inbox' },
                  { icon: Calendar, title: 'Viewings', desc: 'Upcoming property inspections' },
                  { icon: Heart, title: 'Watchlist', desc: 'Track your favorite items', target: 'explore' },
                  { icon: DollarSign, title: 'Transactions', desc: 'Purchase and offer history' }
                ].map((item, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={tw`flex-row items-center justify-between py-4`}
                    onPress={() => {
                      if (item.target) onViewChange(item.target as any);
                      else Alert.alert(item.title, `Opening ${item.title.toLowerCase()} details...`);
                    }}
                  >
                    <View style={tw`flex-row items-center gap-4`}>
                       <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                         <item.icon size={18} color={colors.gold} />
                       </View>
                       <View>
                         <Text style={tw`text-[15px] font-bold text-zinc-900`}>{item.title}</Text>
                         <Text style={tw`text-xs text-zinc-400 font-bold`}>{item.desc}</Text>
                       </View>
                    </View>
                    <ChevronRight size={16} color="#d4d4d8" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={tw`text-[11px] font-bold text-zinc-400 uppercase tracking-[3px] mb-4`}>Preference & Security</Text>
              <View style={tw`gap-1`}>
                {[
                  { icon: Search, title: 'Search Preferences', desc: 'Customize your alerts', target: 'settings' },
                  { icon: Shield, title: 'Privacy & Security', desc: 'Account protection', target: 'settings' },
                ].map((item, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={tw`flex-row items-center justify-between py-4`}
                    onPress={() => {
                      if (item.target) onViewChange(item.target as any);
                      else Alert.alert(item.title, `Opening ${item.title.toLowerCase()} settings...`);
                    }}
                  >
                    <View style={tw`flex-row items-center gap-4`}>
                       <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                         <item.icon size={18} color="#71717a" />
                       </View>
                       <View>
                         <Text style={tw`text-[15px] font-bold text-zinc-900`}>{item.title}</Text>
                         <Text style={tw`text-xs text-zinc-400 font-bold`}>{item.desc}</Text>
                       </View>
                    </View>
                    <ChevronRight size={16} color="#d4d4d8" />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={tw`flex-row items-center justify-between py-4`} onPress={toggleTheme}>
                  <View style={tw`flex-row items-center gap-4`}>
                     <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                        <View style={[tw`w-5 h-5 rounded-full border-2`, { borderColor: colors.gold }]} />
                     </View>
                     <View>
                       <Text style={tw`text-[15px] font-bold text-zinc-900`}>Appearance</Text>
                       <Text style={tw`text-xs text-zinc-400 font-bold`}>Current: {isDark ? 'Dark' : 'Light'} Mode</Text>
                     </View>
                  </View>
                  <View style={tw`px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg`}>
                    <Text style={tw`text-[9px] font-bold uppercase text-zinc-500`}>Toggle</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity 
              style={tw`flex-row items-center justify-center gap-2 py-4 bg-zinc-900 rounded-2xl shadow-lg mt-4`}
              onPress={() => onViewChange('auth')}
            >
              <LogOut size={18} color="white" />
              <Text style={tw`text-white text-sm font-bold uppercase tracking-widest`}>End Session</Text>
            </TouchableOpacity>

            <Text style={tw`text-center text-[10px] text-zinc-300 font-bold tracking-widest pb-10`}>OTULIA LUXURY • VERSION 1.0.4</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
