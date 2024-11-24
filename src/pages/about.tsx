import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/About.css';

const About: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="about-container">
      <Header isAuthorized={!!session} logout={logout} />

      <div className="about-card">
        <Image
          src="/campusConnectLogo.webp"
          alt="Campus Connect Logo"
          width={80}
          height={80}
          className="about-logo"
        />
        <h1>About Campus Connect</h1>
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
        <br />
        <p>Created by Jennifer Ngo, Alyssa Hong, Katelyn Fernandes, and Alex Duong.</p>
      </div>

      <Footer />
    </div>
  );
};

export default About;
