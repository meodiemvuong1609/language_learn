import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';

const STORAGE_KEY = 'll-theme';
const ThemeContext = createContext({ dark: false, toggle: () => {}, setDark: () => {} });

function applyDom(dark) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function ThemeProvider({ children }) {
  const [dark, setDarkState] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const initial = stored === 'dark';
    setDarkState(initial);
    applyDom(initial);
    const token = typeof window !== 'undefined' ? document.cookie.includes('token=') : false;
    if (token) {
      api.getPreferences()
        .then((pref) => {
          if (typeof pref?.dark_mode === 'boolean') {
            setDarkState(pref.dark_mode);
            applyDom(pref.dark_mode);
            localStorage.setItem(STORAGE_KEY, pref.dark_mode ? 'dark' : 'light');
          }
        })
        .catch(() => {});
    }
  }, []);

  const setDark = useCallback((value) => {
    setDarkState(value);
    applyDom(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
    }
    api.updatePreferences({ dark_mode: value }).catch(() => {});
  }, []);

  const toggle = useCallback(() => setDark(!dark), [dark, setDark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
