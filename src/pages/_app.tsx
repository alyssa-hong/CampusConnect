// _app.tsx
import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import { SessionProvider } from 'next-auth/react';
import '../styles/App.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // Make sure the header doesn't show up right after signup
  useEffect(() => {
    if (router.pathname === '/login' || router.pathname === '/signup') {
      setIsAuthorized(false); // Reset authorization status on signup/login
    }
  }, [router.pathname]);

  const logout = () => {
    setIsAuthorized(false);
    router.push('/');
  };

  const showHeader = router.pathname !== '/' && isAuthorized; // Hide header on login and signup pages

  return (
    <SessionProvider session={pageProps.session}>
      <div>
        {showHeader && (
          <Header isAuthorized={isAuthorized} logout={logout} />
        )}
        <Component {...pageProps} setIsAuthorized={setIsAuthorized} isAuthorized={isAuthorized} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
