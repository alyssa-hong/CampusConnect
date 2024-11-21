import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
import '../styles/UnauthorizedPage.css';

const UnauthorizedPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/allEvents');
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched events:', data);
          setEvents(data.events); // Set the events data into state
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
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
        {/* Only render events after they are fetched */}
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <Image
                src={event.eventImage || 'https://via.placeholder.com/250x150'}
                alt={event.eventName}
                width={250}
                height={150}
                className="event-image"
              />
              <h3>
                <strong>Title:</strong> {event.eventName}
              </h3>
              <p>
                <strong>Event Date: {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</strong>
              </p>
              <p>
                <strong>Description:</strong> {event.eventDescription}
              </p>
              <p>
                <strong>Submitted by:</strong> {event.user}
              </p>
              <p>
                <strong>Contact:</strong> {event.contactInfo}
              </p>
            </div>
          ))
        ) : (
          <p>Loading events...</p> // Show a loading state while events are being fetched
        )}
      </div>

      <div style={{ height: '2rem' }}></div>
      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
