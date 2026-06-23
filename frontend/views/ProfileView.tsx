import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Settings, Edit2, Heart, Calendar, Search, Shield, LogOut, ChevronRight, CheckCircle2, DollarSign, MessageCircle, Users, Smartphone } from 'lucide-react-native';
import { useTheme, colors } from '../theme';
import { ViewState, User } from '../types';
import tw from 'twrnc';
import { getUsers } from '../lib/api';
import { openWhatsApp } from '../lib/whatsapp';
import { OptimizedImage } from '../components/OptimizedImage';

interface ProfileViewProps {
  onViewChange: (v: ViewState) => void;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
}

export function ProfileView({ onViewChange, currentUser, setCurrentUser }: ProfileViewProps) {
  const { isDark, toggleTheme } = useTheme();
  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  const activeUser = currentUser || {
    id: '', name: 'Guest', email: '', phone: '', avatar: '', isVerified: false, type: 'buyer' as const
  };

  const [showRegistry, setShowRegistry] = useState(false);
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ id: number; full_name: string; email: string; created_at: string }>>([]);
  const [registryError, setRegistryError] = useState<string | null>(null);

  const handleToggleRegistry = async () => {
    if (!showRegistry) {
      setShowRegistry(true);
      setLoadingRegistry(true);
      setRegistryError(null);
      try {
        const response = await getUsers();
        if (response.success) setRegisteredUsers(response.users);
        else setRegistryError('Failed to fetch registry data.');
      } catch (err: any) {
        setRegistryError(err.message || 'Error communicating with database.');
      } finally {
        setLoadingRegistry(false);
      }
    } else {
      setShowRegistry(false);
    }
  };

  const sections = [
    {
      title: 'Marketplace Activity',
      items: [
        { icon: MessageCircle, title: 'Inquiries', desc: 'Manage your active conversations', target: 'inbox' },
        { icon: Calendar, title: 'Viewings', desc: 'Upcoming property inspections' },
        { icon: Heart, title: 'Watchlist', desc: 'Track your favorite items', target: 'explore' },
        { icon: DollarSign, title: 'Transactions', desc: 'Purchase and offer history' },
      ],
    },
    {
      title: 'Preference & Security',
      items: [
        { icon: Search, title: 'Search Preferences', desc: 'Customize your alerts', target: 'settings' },
        { icon: Shield, title: 'Privacy & Security', desc: 'Account protection', target: 'settings' },
        { icon: Smartphone, title: 'WhatsApp Support', desc: 'Chat with our concierge team', target: 'whatsapp' },
      ],
    },
  ];

  return (
    <View style={[tw`flex-1`, { backgroundColor: bg }]}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-32`}>
        {/* Header Background */}
        <View style={[tw`h-44 w-full relative`, { backgroundColor: surface }]}>
          <View style={tw`absolute top-12 right-6`}>
            <TouchableOpacity style={[tw`p-2.5 rounded-full`, { backgroundColor: bg, borderColor: border, borderWidth: 1 }]} onPress={() => onViewChange('settings')}>
              <Settings size={20} color={text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Section */}
        <View style={tw`px-6 -mt-16`}>
          <View style={tw`flex-row items-end gap-5 mb-6`}>
            <View style={tw`relative`}>
              <TouchableOpacity 
                style={[tw`w-28 h-28 rounded-[32px] border-4 overflow-hidden`, { borderColor: bg, backgroundColor: surface }]}
                onPress={() => Alert.alert('Edit Avatar', 'Opening image picker...')}
              >
                {activeUser.avatar ? (
                  <OptimizedImage src={activeUser.avatar} alt={activeUser.name} style={tw`w-full h-full`} />
                ) : (
                  <View style={tw`w-full h-full items-center justify-center`}>
                    <Text style={[tw`text-3xl font-black`, { color: textMuted }]}>{activeUser.name.charAt(0)}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[tw`absolute -bottom-2 -right-2 w-10 h-10 rounded-full items-center justify-center border-4`, { backgroundColor: colors.gold, borderColor: bg }]}
                onPress={() => Alert.alert('Edit Profile', 'Opening profile editor...')}
              >
                <Edit2 size={14} color="white" />
              </TouchableOpacity>
            </View>
            <View style={tw`flex-1 pb-2`}>
              <View style={tw`flex-row items-center gap-1.5 mb-1`}>
                <Text style={[tw`text-2xl font-black`, { color: text }]}>{activeUser.name}</Text>
                {activeUser.isVerified && <CheckCircle2 size={16} color={colors.gold} />}
              </View>
              <Text style={[tw`text-sm font-bold mb-2`, { color: textMuted }]}>{activeUser.email}</Text>
              <View style={[tw`self-start px-3 py-1 rounded-lg`, { backgroundColor: colors.goldLight, borderWidth: 1, borderColor: 'rgba(193,155,108,0.2)' }]}>
                <Text style={[tw`text-[10px] font-black uppercase tracking-widest`, { color: colors.gold }]}>Platinum Member</Text>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={[tw`flex-row justify-between py-5 mb-6`, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: border }]}>
            {[
              { label: 'Saved', value: '0' },
              { label: 'Alerts', value: '0' },
              { label: 'Offers', value: '0' }
            ].map((stat, i) => (
              <TouchableOpacity key={i} style={tw`items-start flex-1`} onPress={() => Alert.alert(stat.label, `Viewing your ${stat.label.toLowerCase()} history...`)}>
                <Text style={[tw`text-xl font-black mb-0.5`, { color: text }]}>{stat.value}</Text>
                <Text style={[tw`text-[10px] font-black uppercase tracking-widest`, { color: textMuted }]}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Sections */}
          <View style={tw`gap-8`}>
            {sections.map((section, si) => (
              <View key={si}>
                <Text style={[tw`text-[11px] font-black uppercase tracking-[3px] mb-4`, { color: textMuted }]}>{section.title}</Text>
                <View style={[tw`rounded-2xl overflow-hidden`, { backgroundColor: surface }]}>
                  {section.items.map((item, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={[tw`flex-row items-center justify-between px-5 py-4`, i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
                      onPress={() => {
                        if (item.target === 'whatsapp') openWhatsApp('Hi Otulia team, I need assistance.');
                        else if (item.target) onViewChange(item.target as any);
                        else Alert.alert(item.title, `Opening ${item.title.toLowerCase()} details...`);
                      }}
                    >
                      <View style={tw`flex-row items-center gap-4`}>
                        <View style={[tw`w-10 h-10 rounded-xl items-center justify-center`, { backgroundColor: colors.goldLight }]}>
                          <item.icon size={18} color={colors.gold} />
                        </View>
                        <View>
                          <Text style={[tw`text-[15px] font-black`, { color: text }]}>{item.title}</Text>
                          <Text style={[tw`text-xs font-bold`, { color: textMuted }]}>{item.desc}</Text>
                        </View>
                      </View>
                      <ChevronRight size={16} color={textMuted} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Member Registry */}
            <View>
              <Text style={[tw`text-[11px] font-black uppercase tracking-[3px] mb-4`, { color: textMuted }]}>Member Registry</Text>
              <View style={[tw`rounded-2xl overflow-hidden`, { backgroundColor: surface, borderWidth: 1, borderColor: border }]}>
                <TouchableOpacity 
                  style={tw`flex-row items-center justify-between p-4`}
                  onPress={handleToggleRegistry}
                >
                  <View style={tw`flex-row items-center gap-4`}>
                    <View style={[tw`w-10 h-10 rounded-xl items-center justify-center`, { backgroundColor: colors.goldLight }]}>
                      <Users size={18} color={colors.gold} />
                    </View>
                    <View>
                      <Text style={[tw`text-[15px] font-black`, { color: text }]}>Global Registry</Text>
                      <Text style={[tw`text-xs font-bold`, { color: textMuted }]}>View active database users</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color={textMuted} style={{ transform: [{ rotate: showRegistry ? '90deg' : '0deg' }] }} />
                </TouchableOpacity>

                {showRegistry && (
                  <View style={[tw`p-4`, { borderTopWidth: 1, borderTopColor: border }]}>
                    {loadingRegistry ? (
                      <View style={tw`py-4 items-center`}>
                        <ActivityIndicator size="small" color={colors.gold} />
                        <Text style={[tw`text-xs font-bold mt-2`, { color: textMuted }]}>Querying database records...</Text>
                      </View>
                    ) : registryError ? (
                      <Text style={tw`text-xs text-red-500 font-bold text-center py-2`}>{registryError}</Text>
                    ) : registeredUsers.length === 0 ? (
                      <Text style={[tw`text-xs font-bold text-center py-2`, { color: textMuted }]}>No registered members found.</Text>
                    ) : (
                      <View style={tw`gap-3`}>
                        {registeredUsers.map((user) => (
                          <View key={user.id} style={[tw`flex-row items-center justify-between pb-2.5`, { borderBottomWidth: 1, borderBottomColor: border }]}>
                            <View style={tw`flex-1`}>
                              <Text style={[tw`text-xs font-black`, { color: text }]}>{user.full_name}</Text>
                              <Text style={[tw`text-[10px] font-bold`, { color: textMuted }]}>{user.email}</Text>
                            </View>
                            <View style={tw`items-end`}>
                              <Text style={[tw`text-[8px] font-black uppercase px-2 py-0.5 rounded`, { color: colors.gold, backgroundColor: bg, borderWidth: 1, borderColor: border }]}>
                                ID: #{user.id}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity 
              style={[tw`flex-row items-center justify-center gap-2 py-4 rounded-2xl mt-2`, { backgroundColor: colors.gold }]}
              onPress={() => { setCurrentUser(null); onViewChange('auth'); }}
            >
              <LogOut size={18} color="white" />
              <Text style={tw`text-white text-sm font-black uppercase tracking-widest`}>End Session</Text>
            </TouchableOpacity>

            <Text style={[tw`text-center text-[10px] font-black tracking-widest pb-10`, { color: textMuted }]}>OTULIA LUXURY • VERSION 1.0.4</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
