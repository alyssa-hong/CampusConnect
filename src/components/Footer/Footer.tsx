import React from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa'; // Import GitHub logo from react-icons
import './Footer.css';


const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <a
        href="https://github.com/alyssa-hong/campusConnect"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <FaGithub className="footer-icon" aria-label="GitHub" />
      </a>
      <b>
      <Link href="/about" className="footer-link">About Campus Connect</Link>
      </b>
    </footer>
  );
};


export default Footer;