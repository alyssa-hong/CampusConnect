import React from 'react';
import Header from '../components/Header/Header'; 
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router'; 
import Link from 'next/link';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
import '../styles/About.css'; 

const About: React.FC = () => {
  return (
    <div className="about-container">


<header className="header">
<div className="header-center">
        <Image
          src="/campusConnectLogo.webp"
          alt="Campus Connect Logo"
          className="header-logo"
          width={50}
          height={50}
        />
        <h1>
          <Link href="/home">Campus Connect</Link>
        </h1>
      </div>
      </header>

      <div style={{ height: '2rem' }}></div>



      <div className="about-card">
        <h1><b>About Campus Connect</b></h1>
        <p>
          Campus Connect is a platform designed to help UGA students stay
          connected. It allows people to discover events and people to attend events with.
            This helps enhance student communication, resource sharing, and the overall enjoyment of campus life.
        </p>
        <p>
          The website aims to bring the community together by providing easy access to campus resources and events,
          fostering a more engaged and informed campus culture. Also, it provides a platform to make connections and 
          friendships within the Georgia community.
          
          <p><b>At UGA, no one barks alone.</b></p>

            <br></br>
          <p>Created by Jennifer Ngo, Alyssa Hong, Katelyn Fernandes, and Alex Duong.</p>
        </p>
      </div>
    </div>
  );
};

export default About;

