import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../styles/UnauthorizedPage.css';

const events = [
  {
    id: 1,
    title: 'React Workshop',
    date: '2024-11-10',
    time: '10:00 AM',
    description: 'Learn React from scratch!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFi4_-9fNmkOc4nkBq6YLPG8higxuZsBuXGQ&s',
    submitterName: 'John Doe',
    contactInfo: 'johndoe@example.com',
  },
  {
    id: 2,
    title: 'JavaScript for Beginners',
    date: '2024-11-12',
    time: '2:00 PM',
    description: 'A hands-on session to improve your JS skills.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png',
    submitterName: 'Jane Smith',
    contactInfo: 'janesmith@example.com',
  },
  {
    id: 3,
    title: 'Web Development Bootcamp',
    date: '2024-11-15',
    time: '9:00 AM',
    description: 'Intensive bootcamp covering web dev essentials.',
    image: 'https://www.hubspot.com/hubfs/web-development.webp',
    submitterName: 'Alex Johnson',
    contactInfo: 'alexjohnson@example.com',
  },
];

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="unauthorized-page">
      {/* Header Section */}
      <header className="header">
        <div className="left-buttons">
          <Link href="/login" passHref>
            <button className="header-button">Login</button>
          </Link>
        </div>
        <h1>
          <Image
            src="/campusConnectLogo.webp"
            alt="Campus Connect Logo"
            className="header-logo"
            width={50}
            height={50}
          />
          Campus Connect
        </h1>
        <div className="right-buttons">
          <Link href="/signup" passHref>
            <button className="header-button">Sign Up</button>
          </Link>
        </div>
      </header>

      {/* Events Section */}
      <h1 className="event-header">All Events</h1>
      <p className="event-head">Here are all the events happening:</p>

      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <Image
              src={event.image}
              alt={`${event.title} image`}
              className="event-image"
              width={250}
              height={150}
            />
            <h3 className="event-title">{event.title}</h3>
            <p className="event-date-time">{event.date} at {event.time}</p>
            <p className="event-description">{event.description}</p>
            <p className="event-submitter">
              <strong>Submitted by:</strong> {event.submitterName}
            </p>
            <p className="event-contact">
              <strong>Contact:</strong> {event.contactInfo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnauthorizedPage;
