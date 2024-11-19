import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import '../styles/App.css';


function MyApp({ Component, pageProps }: AppProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // Logout function
  const logout = () => {
    setIsAuthorized(false); // Updates the state to unauthorized
    router.push('/'); // Redirects the user to the unauthorized homepage
  };

  const showHeader = router.pathname !== '/' && isAuthorized;

  return (
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
  );
}

export default MyApp;
