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
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'dark');

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

// Color palette
export const colors = {
  gold: '#c19b6c',
  goldLight: 'rgba(193, 155, 108, 0.1)',
  goldMedium: 'rgba(193, 155, 108, 0.4)',
  goldHover: '#b08a5b',
  white: '#ffffff',
  dark: {
    bg: '#0a0a0c',
    surface: '#141518',
    border: '#27272a',
  },
  light: {
    bg: '#ffffff',
    surface: '#f8f8f8',
    border: '#f0f0f0',
  },
};
