import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../styles/UnauthorizedPage.css';

const UnauthorizedPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      // Redirect to /home if the user is logged in
      router.push('/home');
    } else {
      // Fetch events for unauthorized users
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
    }
  }, [session, router]);

  const logout = () => {
    console.log('Unauthorized user tried to log out.');
  };

  return (
    <div>
      <Header isAuthorized={false} logout={logout} />

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Connect with Your Campus Community!</h1>
          <p>Discover events, meet people, and make the most of your college life.</p>
          <button className="cta-button" onClick={() => router.push('/signup')}>
            Join the Community
          </button>
        </div>
      </div>

      {/* Events Section */}
      <div className="events-section">
        <h2>Discover Events</h2>
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
                <h3>{event.eventName}</h3>
                <p>
                  <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()} at{' '}
                  {event.eventTime}
                </p>
                <p>
                  <strong>Description:</strong> {event.eventDescription}
                </p>
                <p>
                  <strong>Location:</strong> {event.location || 'Not provided'}
                </p>
              </div>
            ))
          ) : (
            <p>No events found. Check back later!</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
