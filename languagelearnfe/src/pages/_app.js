import { useEffect } from 'react';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import store from '../store';
import { setToken } from '../store/authSlice';
import DefaultLayout from '../components/layout/DefaultLayout';
import { ToastProvider } from '../components/Toast';
import { ThemeProvider } from '../components/ThemeProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import Head from 'next/head';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  // Rehydrate the auth token from the cookie on the client after mount.
  // Doing this in an effect (rather than in the slice's initialState) keeps
  // the server-rendered markup and the first client render in sync.
  useEffect(() => {
    store.dispatch(setToken(Cookies.get('token') || null));
  }, []);

  // Support both the Next.js `getLayout` per-page pattern (used by most pages)
  // and the simpler static `layout` property (used by login/home).
  const getLayout =
    Component.getLayout ||
    ((page) => {
      const PageLayout = Component.layout || DefaultLayout;
      return <PageLayout>{page}</PageLayout>;
    });

  return (
    <Provider store={store}>
      <Head>
        <title>Ngọc Thảo IELTS</title>
      </Head>
      <ErrorBoundary>
        <ToastProvider>
          <ThemeProvider>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
        </ToastProvider>
      </ErrorBoundary>
    </Provider>
  );
}
