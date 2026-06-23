import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Edit, MessageSquare } from 'lucide-react-native';
import { ViewState } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';

export function InboxView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('All Messages');
  const tabs = ['All Messages', 'Unread', 'Starred', 'Archive'];

  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textSecondary = isDark ? colors.dark.textSecondary : colors.light.textSecondary;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  return (
    <View style={[tw`flex-1`, { backgroundColor: bg }]}>
      <View style={[tw`px-6 pt-16 pb-8 flex-row justify-between items-end`, { backgroundColor: bg }]}>
        <View>
          <Text style={[tw`text-4xl font-black`, { color: text }]}>Inbox</Text>
          <Text style={[tw`text-xs font-bold mt-1 uppercase tracking-widest`, { color: textMuted }]}>Messages & inquiries</Text>
        </View>
        <TouchableOpacity style={[tw`p-2.5 rounded-full`, { backgroundColor: surface, borderColor: border, borderWidth: 1 }]} onPress={() => onViewChange('settings')}>
          <Edit size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>

      <View style={tw`px-6 mb-8`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2.5`}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[
                  tw`px-4 py-2.5 rounded-full`, 
                  isActive 
                    ? { backgroundColor: colors.gold } 
                    : { backgroundColor: surface, borderWidth: 1, borderColor: border }
                ]}
              >
                <Text style={[tw`text-xs font-black uppercase tracking-wider`, { color: isActive ? '#fff' : textMuted }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={tw`flex-1 items-center justify-center px-8 pb-32`}>
        <View style={[tw`w-20 h-20 rounded-full items-center justify-center mb-6`, { backgroundColor: colors.goldLight }]}>
          <MessageSquare size={32} color={colors.gold} />
        </View>
        <Text style={[tw`text-xl font-black mb-2 text-center`, { color: text }]}>No messages yet</Text>
        <Text style={[tw`text-sm text-center leading-5`, { color: textMuted }]}>
          When someone inquires about your listing, their messages will appear here.
        </Text>
      </View>
    </View>
  );
}
