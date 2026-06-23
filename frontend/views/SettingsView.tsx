import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { ArrowLeft, Bell, Shield, User, Globe, Moon, CreditCard, ChevronRight, HelpCircle, Info, Smartphone } from 'lucide-react-native';
import { ViewState } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';
import { openWhatsApp } from '../lib/whatsapp';

export function SettingsView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textSecondary = isDark ? colors.dark.textSecondary : colors.light.textSecondary;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: User, title: 'Personal Information', desc: 'Manage your profile details' },
        { icon: Shield, title: 'Login & Security', desc: 'Password and authentication' },
        { icon: CreditCard, title: 'Payment Methods', desc: 'Cards and billing details' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, title: 'Push Notifications', desc: 'Alerts and updates', toggle: true, value: true },
        { icon: Moon, title: 'Dark Appearance', desc: isDark ? 'Dark mode active' : 'Light mode active', toggle: true, value: isDark, onToggle: toggleTheme },
        { icon: Globe, title: 'Language', desc: 'English (United Kingdom)' },
      ],
    },
    {
      title: 'Support & Legal',
      items: [
        { icon: HelpCircle, title: 'Help Center' },
        { icon: Info, title: 'About Otulia' },
        { icon: Shield, title: 'Privacy Policy' },
        { icon: Smartphone, title: 'WhatsApp Support', target: 'whatsapp' },
      ],
    },
  ];

  return (
    <View style={[tw`flex-1`, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[tw`px-6 pt-16 pb-6 flex-row items-center`, { borderBottomWidth: 1, borderBottomColor: border }]}>
        <TouchableOpacity style={[tw`p-2 rounded-full mr-4`, { backgroundColor: surface }]} onPress={() => onViewChange('profile')}>
          <ArrowLeft size={20} color={text} />
        </TouchableOpacity>
        <Text style={[tw`text-2xl font-black`, { color: text }]}>Settings</Text>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-20`}>
        {sections.map((section, si) => (
          <View key={si} style={tw`mt-8`}>
            <View style={tw`px-6 mb-4`}>
              <Text style={[tw`text-[10px] font-black uppercase tracking-[3px]`, { color: textMuted }]}>{section.title}</Text>
            </View>
            
            <View style={[tw`mx-4 rounded-2xl overflow-hidden`, { backgroundColor: surface }]}>
              {section.items.map((item, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[tw`flex-row items-center justify-between px-5 py-4`, i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
                  onPress={() => {
                    if (item.target === 'whatsapp') openWhatsApp('Hi Otulia team, I need assistance.');
                    else if (!item.toggle) Alert.alert(item.title, `Opening ${item.title}...`);
                  }}
                >
                  <View style={tw`flex-row items-center gap-4`}>
                    <View style={[tw`w-10 h-10 rounded-xl items-center justify-center`, { backgroundColor: colors.goldLight }]}>
                      <item.icon size={18} color={colors.gold} />
                    </View>
                    <View>
                      <Text style={[tw`text-sm font-black`, { color: text }]}>{item.title}</Text>
                      <Text style={[tw`text-xs font-bold`, { color: textMuted }]}>{item.desc}</Text>
                    </View>
                  </View>
                  {item.toggle ? (
                    <Switch 
                      value={item.value} 
                      onValueChange={item.onToggle}
                      trackColor={{ false: border, true: colors.gold }}
                      thumbColor={'#ffffff'}
                    />
                  ) : (
                    <ChevronRight size={16} color={textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={tw`px-6 mt-12 mb-10`}>
           <Text style={[tw`text-center text-[10px] font-black tracking-[2px]`, { color: textMuted }]}>OTULIA LUXURY • VERSION 1.0.4</Text>
        </View>
      </ScrollView>
    </View>
  );
}
