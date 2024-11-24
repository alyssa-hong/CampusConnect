import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import '../styles/profilehome.css';

const ProfileHome: React.FC = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/getUser?email=${session.user.email}`);
          const data = await res.json();
          if (res.ok) setUsername(data.userName);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserEvents = async () => {
        try {
          const res = await fetch(`/api/eventsByUsername?email=${session.user.email}`);
          const data = await res.json();
          if (res.ok) setEvents(data.events);
        } catch (error) {
          console.error('Error fetching events:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserEvents();
    }
  }, [session?.user?.email]);

  const logout = async () => {
    setIsAuthorized(false);
    await signOut({ callbackUrl: '/' });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/deleteEvents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <>
    <Header setIsAuthorized={setIsAuthorized} isAuthorized={isAuthorized} logout={logout} />
    <div className="profile-home">
      <h1>Welcome, {username || 'Loading...'}</h1>
      <div className="p-event-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="p-event-card">
              <h2>{event.eventName}</h2>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
              </p>
              <p>
                <strong>Description:</strong> {event.eventDescription}
              </p>
              <p>
                <strong>Location:</strong> {event.location || 'Not provided'}
              </p>
              <div className="p-event-actions">
                <button className="edit-button" onClick={() => router.push(`/editEvent/${event._id}`)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(event._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-event">No events found. Start creating events!</div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProfileHome;
