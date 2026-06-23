
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react-native';
import { ViewState } from '../types';
import { useTheme, colors } from '../theme';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export function BottomNav({ currentView, onChange }: BottomNavProps) {
  const { isDark } = useTheme();
  const isAuth = currentView === 'auth';
  if (isAuth) return null;

  const getIconColor = (active: boolean) => active ? colors.gold : isDark ? '#a1a1aa' : '#71717a';
  const getLabelColor = (active: boolean) => active ? colors.gold : isDark ? '#a1a1aa' : '#71717a';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(10,10,12,0.95)' : 'rgba(255,255,255,0.95)', borderTopColor: isDark ? colors.dark.border : colors.light.border }]}>
      <TouchableOpacity style={styles.tab} onPress={() => onChange('home')}>
        <Home size={22} color={getIconColor(currentView === 'home')} />
        <Text style={[styles.label, { color: getLabelColor(currentView === 'home') }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onChange('explore')}>
        <Compass size={22} color={getIconColor(currentView === 'explore')} />
        <Text style={[styles.label, { color: getLabelColor(currentView === 'explore') }]}>Explore</Text>
      </TouchableOpacity>

      {/* Floating FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => onChange('add-listing')}>
          <Plus size={28} color={colors.gold} />
        </TouchableOpacity>
        <Text style={[styles.label, { color: isDark ? '#a1a1aa' : '#71717a', marginTop: 4 }]}>Sell</Text>
      </View>

      <TouchableOpacity style={styles.tab} onPress={() => onChange('inbox')}>
        <MessageSquare size={22} color={getIconColor(currentView === 'inbox')} />
        <Text style={[styles.label, { color: getLabelColor(currentView === 'inbox') }]}>Inbox</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onChange('profile')}>
        <User size={22} color={getIconColor(currentView === 'profile')} />
        <Text style={[styles.label, { color: getLabelColor(currentView === 'profile') }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    paddingTop: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'relative',
    top: -16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#18181b',
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
