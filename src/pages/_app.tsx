import React, { useState } from 'react';
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

  // Logout function
  const logout = () => {
    setIsAuthorized(false);
    router.push('/'); 
  };

  const showHeader = router.pathname !== '/' && isAuthorized;

  return (
    <SessionProvider session={pageProps.session}> 
      <div>
        {showHeader && (
          <Header
            setIsAuthorized={setIsAuthorized}
            isAuthorized={isAuthorized}
            logout={logout}
          />
        )}
        <Component {...pageProps} setIsAuthorized={setIsAuthorized} isAuthorized={isAuthorized} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
