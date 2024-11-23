import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Import session and signOut
import { useRouter } from 'next/router'; // Import useRouter for navigation
import Header from '../components/Header/Header'; // Import Header component
import '../styles/profilehome.css'; // Import styles

const ProfileHome: React.FC = () => {
  const { data: session } = useSession(); // Access user session data
  const [username, setUsername] = useState<string>(''); // State to store the username
  const [events, setEvents] = useState<any[]>([]); // State to store events
  const [isAuthorized, setIsAuthorized] = useState(true); // Authorization state
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter(); // Router for navigation

  // Fetch username for the logged-in user
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
  }, [session?.user?.email]); // Run this effect when the session email changes

  // Fetch events for the logged-in user
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserEvents = async () => {
        try {
          const res = await fetch(`/api/eventsByUsername?email=${session.user.email}`);
          const data = await res.json();

          if (res.ok) {
            setEvents(data.events); // Update state with fetched events
          } else {
            console.error('Error fetching events:', data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false); // End loading state
        }
      };

      fetchUserEvents();
    }
  }, [session?.user?.email]); // Trigger fetching of events when the email changes

  // Handle user logout
  const logout = async () => {
    setIsAuthorized(false);
    await signOut({ callbackUrl: '/' }); // Sign out and redirect to home page
  };

  // Handle deleting an event
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/deleteEvents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send event ID in request body
      });

      const data = await res.json();

      if (res.ok) {
        setEvents(events.filter((event) => event._id !== id)); // Remove deleted event from state
      } else {
        console.error('Error deleting event:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading message
  }

  return (
    <div className="profile-home">
      {/* Include Header component */}
      <Header 
        setIsAuthorized={setIsAuthorized} 
        isAuthorized={isAuthorized} 
        logout={logout} 
      />

      <h1>Welcome, {username || 'Loading...'}</h1> {/* Show username or loading text */}

      <div className="event-list">
        {/* Render fetched events */}
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <p><strong>Event Name:</strong> {event.eventName}</p>
              <p>
                <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()} at{' '}
                {event.eventTime}
              </p>
              <p><strong>Description:</strong> {event.eventDescription}</p>
              <p><strong>Location:</strong> {event.location || 'Not provided'}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(event._id)} // Delete event
              >
                Delete
              </button>
              <button
                className="edit-button"
                onClick={() => router.push(`/editEvent/${event._id}`)} // Redirect to edit event page
              >
                Edit
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
