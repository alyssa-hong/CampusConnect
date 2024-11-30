import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the user icon
import './Header.css';

interface HeaderProps {
  isAuthorized: boolean;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthorized, logout }) => {
  const router = useRouter();

  // Check if current route is login or signup to hide the header
  const hideHeader = router.pathname === '/login' || router.pathname === '/signup';

  return (
    !hideHeader && (
      <header className="header">
        <div className="header-left">
          {isAuthorized && (
            <>
              {/* Replace Profile Home button with User Icon */}
              <Link href="/profile-home">
                <button className="icon-button profile-button">
                  <FontAwesomeIcon icon={faUser} />
                </button>
              </Link>
              <Link href="/profile">
                <button className="settings-button">Settings</button>
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
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
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
    )
  );
};

export default Header;
