import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import Link from 'next/link';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
import '../styles/HomePage.css'; 

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push('/unauthorized');
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/allEvents');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const isAuthorized = status === 'authenticated';

  return (
    <div className="page-container">
      {/* Header */}
      <Header isAuthorized={isAuthorized} logout={logout} />

      {/* Main Content */}
      <main className="content">
        <h1 className="event-header">All Events</h1>
        <p className="event-head">Here are all the events happening:</p>

        <div className="event-list">
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
                <h3><strong>Title:</strong> {event.eventName}</h3>
                <p><strong>Event Date:</strong> {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</p>
                <p><strong>Description:</strong> {event.eventDescription}</p>
                <p><strong>Submitted by:</strong> {event.user}</p>
                <p><strong>Contact:</strong> {event.contactInfo}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
            ))
          ) : (
            <p>{events.length === 0 ? 'No events found.' : 'Loading events...'}</p>
          )}
        </div>

        <Link href="/add-event">
          <button className="add-event-button" aria-label="Add a new event">Add Event</button>
        </Link>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
