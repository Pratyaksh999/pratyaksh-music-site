import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark';
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const savedColor = localStorage.getItem('colorTheme');
    return savedColor || 'green';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('colorTheme', colorTheme);

    // Update document classes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);

    // Update color theme
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }, [mode, colorTheme]);

  const toggleMode = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colorThemes = {
    red: {
      name: 'Fire',
      primary: '#FF3D00',
      secondary: '#FF6D00',
      tertiary: '#FFB300',
    },
    green: {
      name: 'Emerald',
      primary: '#059669',
      secondary: '#10B981',
      tertiary: '#34D399',
    },
    blue: {
      name: 'Ocean',
      primary: '#3B82F6',
      secondary: '#60A5FA',
      tertiary: '#93C5FD',
    },
    yellow: {
      name: 'Gold',
      primary: '#F59E0B',
      secondary: '#FBBF24',
      tertiary: '#FCD34D',
    },
  };

  const value = {
    mode,
    colorTheme,
    toggleMode,
    setColorTheme,
    isDark: mode === 'dark',
    colors: colorThemes[colorTheme],
    colorThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
