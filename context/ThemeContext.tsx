
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type ThemeColors = {
  background: string;
  card: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  textLight: string;
};

type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const lightColors: ThemeColors = {
  background: '#F5F1E8',
  card: '#FFFFFF',
  primary: '#1F3A5F',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  textLight: '#FFFFFF',
};

const darkColors: ThemeColors = {
  background: '#111827',
  card: '#1F2937',
  primary: '#3B82F6',
  textPrimary: '#F9FAFB',
  textSecondary: '#CBD5E1',
  border: '#374151',
  textLight: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(
          'qr-attendance-theme',
        );
        setIsDark(savedTheme === 'dark');
      } catch (error) {
        console.warn('Could not load theme:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadTheme();
  }, []);

  async function toggleTheme() {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    try {
      await AsyncStorage.setItem(
        'qr-attendance-theme',
        nextIsDark ? 'dark' : 'light',
      );
    } catch (error) {
      console.warn('Could not save theme:', error);
    }
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ colors, isDark, toggleTheme }}
    >
      {loaded ? children : null}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
