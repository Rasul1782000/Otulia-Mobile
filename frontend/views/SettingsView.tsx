import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { ArrowLeft, Bell, Shield, User, Globe, Moon, CreditCard, ChevronRight, HelpCircle, Info, Smartphone } from 'lucide-react-native';
import { ViewState } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';
import { openWhatsApp } from '../lib/whatsapp';

export function SettingsView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 pt-16 pb-6 flex-row items-center border-b border-zinc-100`}>
        <TouchableOpacity style={tw`p-2 bg-zinc-50 rounded-full mr-4`} onPress={() => onViewChange('profile')}>
          <ArrowLeft size={20} color="#18181b" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-zinc-900`}>Settings</Text>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-20`}>
        {/* Section: Account */}
        <View style={tw`mt-8`}>
          <View style={tw`px-6 mb-4`}>
            <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-[3px]`}>Account Settings</Text>
          </View>
          
          <View style={tw`bg-white`}>
            {[
              { icon: User, title: 'Personal Information', desc: 'Manage your profile details' },
              { icon: Shield, title: 'Login & Security', desc: 'Password and authentication' },
              { icon: CreditCard, title: 'Payment Methods', desc: 'Cards and billing details' },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={tw`flex-row items-center justify-between px-6 py-5 border-b border-zinc-50`}>
                <View style={tw`flex-row items-center gap-4`}>
                   <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                     <item.icon size={18} color={colors.gold} />
                   </View>
                   <View>
                     <Text style={tw`text-sm font-bold text-zinc-900`}>{item.title}</Text>
                     <Text style={tw`text-xs text-zinc-400 font-bold`}>{item.desc}</Text>
                   </View>
                </View>
                <ChevronRight size={16} color="#d4d4d8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: Preferences */}
        <View style={tw`mt-8`}>
          <View style={tw`px-6 mb-4`}>
            <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-[3px]`}>Preferences</Text>
          </View>
          
          <View style={tw`bg-white`}>
            <View style={tw`flex-row items-center justify-between px-6 py-5 border-b border-zinc-50`}>
              <View style={tw`flex-row items-center gap-4`}>
                 <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                   <Bell size={18} color={colors.gold} />
                 </View>
                 <View>
                   <Text style={tw`text-sm font-bold text-zinc-900`}>Push Notifications</Text>
                   <Text style={tw`text-xs text-zinc-400 font-bold`}>Alerts and updates</Text>
                 </View>
              </View>
              <Switch 
                value={true} 
                trackColor={{ false: '#f4f4f5', true: colors.gold }}
                thumbColor={'#ffffff'}
              />
            </View>

            <TouchableOpacity style={tw`flex-row items-center justify-between px-6 py-5 border-b border-zinc-50`} onPress={toggleTheme}>
              <View style={tw`flex-row items-center gap-4`}>
                 <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                   <Moon size={18} color={colors.gold} />
                 </View>
                 <View>
                   <Text style={tw`text-sm font-bold text-zinc-900`}>Dark Appearance</Text>
                   <Text style={tw`text-xs text-zinc-400 font-bold`}>Toggle theme mode</Text>
                 </View>
              </View>
              <Switch 
                value={isDark} 
                onValueChange={toggleTheme}
                trackColor={{ false: '#f4f4f5', true: colors.gold }}
                thumbColor={'#ffffff'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={tw`flex-row items-center justify-between px-6 py-5 border-b border-zinc-50`}>
              <View style={tw`flex-row items-center gap-4`}>
                 <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                   <Globe size={18} color={colors.gold} />
                 </View>
                 <View>
                   <Text style={tw`text-sm font-bold text-zinc-900`}>Language</Text>
                   <Text style={tw`text-xs text-zinc-400 font-bold`}>English (United Kingdom)</Text>
                 </View>
              </View>
              <ChevronRight size={16} color="#d4d4d8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Support */}
        <View style={tw`mt-8`}>
          <View style={tw`px-6 mb-4`}>
            <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-[3px]`}>Support & Legal</Text>
          </View>
          
          <View style={tw`bg-white`}>
            {[
              { icon: HelpCircle, title: 'Help Center' },
              { icon: Info, title: 'About Otulia' },
              { icon: Shield, title: 'Privacy Policy' },
              { icon: Smartphone, title: 'WhatsApp Support', target: 'whatsapp' },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={tw`flex-row items-center justify-between px-6 py-5 border-b border-zinc-50`}
                onPress={() => {
                  if (item.target === 'whatsapp') openWhatsApp('Hi Otulia team, I need assistance.');
                  else Alert.alert(item.title, `Opening ${item.title}...`);
                }}
              >
                <View style={tw`flex-row items-center gap-4`}>
                   <View style={[tw`w-10 h-10 rounded-xl items-center justify-center bg-zinc-50`]}>
                     <item.icon size={18} color="#71717a" />
                   </View>
                   <Text style={tw`text-sm font-bold text-zinc-900`}>{item.title}</Text>
                </View>
                <ChevronRight size={16} color="#d4d4d8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={tw`px-6 mt-12 mb-10`}>
           <Text style={tw`text-center text-[10px] text-zinc-300 font-bold tracking-[2px]`}>OTULIA LUXURY • VERSION 1.0.4</Text>
        </View>
      </ScrollView>
    </View>
  );
}
