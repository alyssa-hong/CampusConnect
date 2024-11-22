import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import '../styles/profilehome.css';

const ProfileHome: React.FC = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/getUser?email=${session.user.email}`);
          const data = await res.json();

          if (res.ok) {
            setUsername(data.userName);
          } else {
            console.error('Error fetching user data:', data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.email]);

  // Fetch user events
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserEvents = async () => {
        try {
          const res = await fetch(`/api/eventsByUsername?email=${session.user.email}`);
          const data = await res.json();

          if (res.ok) {
            setEvents(data.events || []);
          } else {
            console.error('Error fetching events:', data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserEvents();
    }
  }, [session?.user?.email]);

  // Handle logout
  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Handle delete event
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/deleteEvents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      } else {
        const data = await res.json();
        console.error('Error deleting event:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-home">
      <Header isAuthorized={!!session} logout={logout} />

      <h1>Welcome, {username || 'User'}</h1>

      <div className="card-box">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="card">
              <div>
                <p><strong>{event.eventName}</strong></p>
                <p>{new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</p>
                <p>{event.eventDescription}</p>
                <p>{event.location}</p>
              </div>
              <div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileHome;
