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
        Campus Connect is a platform designed to help UGA students stay engaged and connected. 
        It allows users to post events and share their contact information, making it easier 
        for others to discover activities they'd like to attend. Users can connect with event 
        posters to coordinate attendance, fostering collaboration and shared experiences.
        </p>
        <p>
        The website's goal is to strengthen the UGA community by providing seamless access to 
        campus events and resources. By encouraging participation and interaction, Campus Connect 
        supports the development of meaningful connections, friendships, and a vibrant campus culture.
        </p>
          <p><b>At UGA, no one barks alone.</b></p>

            <br></br>
          <p>Created by Jennifer Ngo, Alyssa Hong, Katelyn Fernandes, and Alex Duong.</p>
      
      </div>
    </div>
  );
};

export default About;

