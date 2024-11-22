import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import './Header.css';

interface HeaderProps {
  setIsAuthorized: (auth: boolean) => void;
  isAuthorized: boolean;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuthorized, isAuthorized, logout }) => {
  const router = useRouter();
  const isProfilePage = router.pathname === '/profile-home';  // Check if on profile page

  return (
    <header className="header">
      <div className="header-left">
        {isAuthorized && (
          <>
            <Link href="/profile-home">
              <button className="profile-button">
                <span>Profile Home</span>
              </button>
            </Link>
            <Link href="/profile">
              <button className="settings-button">
                Settings
              </button>
            </Link>
          </>
        )}
      </div>
      
      <div className="header-center">
        <Image
          src="/campusConnectLogo.webp"
          alt="Campus Connect Logo"
          className="header-logo"
          width={40}
          height={40}
        />
        <h1>
          <Link href="/home">Campus Connect</Link>
        </h1>
      </div>

      <div className="header-right">
        {isAuthorized ? (
          isProfilePage ? (
            <>
              <button
                className="addevent-button"
                onClick={() => router.push('/add-event')}
              >
                +Add Event
              </button>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          )
        ) : (
          <>
            <Link href="/login">
              <button className="header-button">Login</button>
            </Link>
            <Link href="/signup">
              <button className="header-button">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
