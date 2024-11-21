import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../components/Header/Header'; // Import Header component
import '../styles/profilehome.css';

const ProfileHome: React.FC = () => {
  const { data: session } = useSession(); // Access the session to get the email
  const [username, setUsername] = useState<string>(''); // State to store the username
  const [events, setEvents] = useState<any[]>([]); // State to store events
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent mismatch

  // Fetch username for the logged-in user from /api/getUser (based on email)
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/getUser?email=${session.user.email}`);
          const data = await res.json();

          if (res.ok) {
            setUsername(data.userName); // Set the fetched username
          } else {
            console.error('Error fetching user data:', data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.email]); // Only run this effect once when the session changes

  // Fetch events for the logged-in user from /api/eventsByContactInfo (based on email)
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserEvents = async () => {
        try {
          const res = await fetch(`/api/eventsByUsername?email=${session.user.email}`);
          const data = await res.json();

          if (res.ok) {
            setEvents(data.events); // Set the events fetched for the user
          } else {
            console.error('Error fetching events:', data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false); // Set loading to false once the data is fetched
        }
      };

      fetchUserEvents();
    }
  }, [session?.user?.email]); // Trigger fetching of events when the email changes

  // Dummy logout function
  const logout = () => {
    setIsAuthorized(false);
    // Handle additional logout functionality if needed
  };

  // Function to handle card deletion
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/deleteEvents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send the event ID in the body
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // If the deletion is successful, update the state
        setEvents(events.filter(event => event._id !== id));
      } else {
        console.error('Error deleting event:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while data is being fetched
  }

  return (
    <div className="profile-home">
      {/* Include Header component */}
      <Header 
        setIsAuthorized={setIsAuthorized} 
        isAuthorized={isAuthorized} 
        logout={logout} 
      />

      <h1>Welcome, {username || 'Loading...'}</h1> {/* Display username or loading message */}

      <div className="event-list">
        {/* Render fetched events */}
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <p>{event.eventName}</p>
              <p>{new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</p>
              <p>{event.eventDescription}</p>
              <button className="delete-button" onClick={() => handleDelete(event._id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No events found.</p> // Display if no events are available
        )}
      </div>
    </div>
  );
};

export default ProfileHome;
