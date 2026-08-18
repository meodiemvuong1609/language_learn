import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { type Locale, locales } from '@/content/site';

const STORAGE_KEY = 'll-landing-locale';

type Ctx = {
  locale: Locale;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

function readQuery(query: unknown): Locale | null {
  if (query === 'vi' || query === 'en') return query;
  return null;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>('vi');

  useEffect(() => {
    const fromQuery = readQuery(router.query['lang']);
    if (fromQuery) {
      setLocaleState(fromQuery);
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'vi' || saved === 'en') setLocaleState(saved);
  }, [router.query]);

  useEffect(() => {
    document.documentElement.lang = locale === 'vi' ? 'vi' : 'en';
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      const nextQuery = { ...router.query, lang: next };
      void router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
    },
    [router],
  );

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}
