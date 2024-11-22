import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Image from 'next/image';
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
            console.log('Fetched events:', data);
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
      {/* Reuse the Header component */}
      <Header isAuthorized={false} logout={logout} />

      {/* Events Section */}
      <h1 className="event-header">All Events</h1>
      <p className="event-head">Here are all the events happening:</p>

      <div className="event-list">
        {/* Render events if available */}
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
                <strong>
                  Event Date: {new Date(event.eventDate).toLocaleDateString()} at{' '}
                  {event.eventTime}
                </strong>
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
          <p>Loading events...</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
