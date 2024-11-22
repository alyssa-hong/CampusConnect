import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import Link from 'next/link';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const { data: session, status } = useSession(); // Destructure status to check loading state
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
  
  // Check if session is still loading
  const isAuthorized = status === 'authenticated';

  return (
    <div>
      <Header
        isAuthorized={isAuthorized} // Pass the updated isAuthorized state
        logout={logout}
      />
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
              <h3><strong>Title:</strong> {event.eventName}</h3>
              <p><strong>Event Date: {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</strong></p>
              <p><strong>Description:</strong> {event.eventDescription}</p>
              <p><strong>Submitted by:</strong> {event.user}</p>
              <p><strong>Contact:</strong> {event.contactInfo}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
          ))
        ) : (
          <p>Loading events...</p> // Show a loading state while events are being fetched
        )}
      </div>

      <Link href="/add-event">
        <button className="add-event-button">Add Event</button>
      </Link>

      <div style={{ height: '2rem' }}></div>
      <Footer />
    </div>
  );
};

export default HomePage;
