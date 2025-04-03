import { gsap } from 'gsap';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Fix theme initialization
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    // Fix theme application
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    // Add transition class for smooth theme changes
    root.style.setProperty('--transition-duration', '0.3s');
    root.classList.add('transition-colors');
  }, [theme]);

  const toggleTheme = () => {
    gsap.to('body', {
      backgroundColor: theme === 'light' ? '#1a1b1e' : '#ffffff',
      duration: 0.3,
      onComplete: () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
