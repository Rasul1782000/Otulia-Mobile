import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Color palette — matching otulia.com design system
export const colors = {
  // Primary brand gold (from otulia.com: #D48D2A / #b18b24)
  gold: '#b18b24',
  goldLight: 'rgba(177, 139, 36, 0.12)',
  goldMedium: 'rgba(177, 139, 36, 0.35)',
  goldHover: '#D48D2A',
  goldDark: '#9C824A',
  white: '#ffffff',
  dark: {
    bg: '#080808',
    surface: '#1a1a1a',
    surfaceHover: '#2a2a2a',
    border: '#2c2c2c',
    borderLight: '#1e1e1e',
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    card: '#1a1a1a',
    cardBorder: '#2c2c2c',
    input: '#1a1a1a',
    inputBorder: '#2c2c2c',
    overlay: 'rgba(0,0,0,0.7)',
    badge: '#2c2c2c',
  },
  light: {
    bg: '#fcfcfc',
    surface: '#F8F7F4',
    surfaceHover: '#f2f2f2',
    border: '#e8e8e8',
    borderLight: '#f0f0f0',
    text: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    card: '#ffffff',
    cardBorder: '#e8e8e8',
    input: '#f7f7f7',
    inputBorder: '#e8e8e8',
    overlay: 'rgba(0,0,0,0.5)',
    badge: '#f4f4f4',
  },
};
