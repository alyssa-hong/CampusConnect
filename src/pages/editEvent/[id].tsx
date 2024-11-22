import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'; 
import Header from '@/components/Header/Header'; // Adjust the path as needed

const EditEventPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract event ID from the URL

  const [event, setEvent] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventDescription: '',
    location: '', // Corrected to match schema
  });

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null);

  // Mock logout function (replace with actual logic)
  const logout = async () => {
    setIsAuthorized(false);
    await signOut({ callbackUrl: '/' }); // Log out the user and redirect to the home page
  };

  useEffect(() => {
    // Check if user is authorized (replace with actual auth logic)
    const checkAuthorization = async () => {
      const isAuth = true; // Replace with your auth logic
      setIsAuthorized(isAuth);

      if (!isAuth) {
        router.push('/login'); // Redirect if unauthorized
      }
    };

    checkAuthorization();
  }, []);

  useEffect(() => {
    // Fetch event data when the ID is available
    if (id) {
      const fetchEventData = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/getEventById?id=${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch event data');
          }

          const data = await res.json();
          setEvent({
            eventName: data.eventName || '',
            eventDate: formatDate(data.eventDate || new Date().toISOString()),
            eventTime: preprocessTime(data.eventTime || ''),
            eventDescription: data.eventDescription || '',
            location: data.location || '', // Corrected field name here
          });
        } catch (err) {
          setError((err as Error).message || 'An error occurred while fetching event data');
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();
    }
  }, [id]);

  const preprocessTime = (time: string) => {
    if (/^\d{2}:\d{2} (AM|PM)$/i.test(time)) {
      return time.split(' ')[0]; // Remove AM/PM
    }
    return /^\d{2}:\d{2}$/.test(time) ? time : '00:00';
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0]; // Return as yyyy-mm-dd
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/updateEvent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, updatedEvent: event }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update event');
      }

      router.push(`/profile-home`); // Redirect on success
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (!isAuthorized) {
    return null; // Optionally, render a loading spinner or redirect logic here
  }

  if (loading) {
    return <div>Loading event...</div>; // Loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Error message
  }

  return (
    <div className="edit-event-page">
      <Header
        setIsAuthorized={setIsAuthorized}
        isAuthorized={isAuthorized}
        logout={logout}
      />
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={event.eventName}
            onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            value={event.eventDate}
            onChange={(e) => setEvent({ ...event, eventDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Time</label>
          <input
            type="time"
            value={event.eventTime}
            onChange={(e) => setEvent({ ...event, eventTime: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={event.eventDescription}
            onChange={(e) =>
              setEvent({ ...event, eventDescription: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Event Location</label>
          <input
            type="text"
            value={event.location} // Corrected field name here
            onChange={(e) =>
              setEvent({ ...event, location: e.target.value }) // Corrected field name here
            }
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
