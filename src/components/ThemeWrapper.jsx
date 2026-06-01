import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeWrapper = ({ children }) => {
  const { colors } = useTheme();

  useEffect(() => {
    // Update CSS variables when theme changes
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    document.documentElement.style.setProperty('--theme-tertiary', colors.tertiary);
  }, [colors]);

  return children;
};

export default ThemeWrapper;
