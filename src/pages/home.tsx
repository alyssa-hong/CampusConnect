import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router'; 
import Header from '../components/Header/Header'; 
import Link from 'next/link';
import Footer from '../components/Footer/Footer';
import Image from 'next/image';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const { data: session } = useSession(); 
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const [events, setEvents] = useState<any[]>([]); 
  const router = useRouter(); 

  useEffect(() => {
    if (session) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  
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
  }, [session]);
  

  const logout = async () => {
    await signOut(); 
    setIsAuthorized(false);
    router.push('/unauthorized'); 
  };

  return (
    <div>
      <Header 
        isAuthorized={isAuthorized} 
        setIsAuthorized={setIsAuthorized} 
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
