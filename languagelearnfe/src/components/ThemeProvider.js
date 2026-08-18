import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ dark: false, toggle: () => {}, setDark: () => {} });

function applyLight() {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', 'light');
}

export function ThemeProvider({ children }) {
  const [dark] = useState(false);

  useEffect(() => {
    applyLight();
  }, []);

  const setDark = useCallback(() => {
    applyLight();
  }, []);

  const toggle = useCallback(() => {
    applyLight();
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggle, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
