import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Header from '@/components/Header/Header';
import './editEvent.css';

const EditEventPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventDescription: '',
    location: '',
  });

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsAuthorized(false);
    await signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      const isAuth = true; 
      setIsAuthorized(isAuth);

      if (!isAuth) {
        router.push('/login');
      }
    };

    checkAuthorization();
  }, [router]);

  useEffect(() => {
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
            eventTime: data.eventTime || '', 
            eventDescription: data.eventDescription || '',
            location: data.location || '',
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

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0];
  };

  const isValidTimeFormat = (time: string) => {
    const regex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    return regex.test(time.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidTimeFormat(event.eventTime)) {
      alert('Invalid time format. Please use hh:mm AM/PM.');
      return;
    }

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

      router.push(`/profile-home`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return <div>Loading event...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header setIsAuthorized={setIsAuthorized} isAuthorized={isAuthorized} logout={logout} />
      <div className="edit-event-page">
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
            <label>Event Time (hh:mm AM/PM)</label>
            <input
              type="text"
              value={event.eventTime}
              onChange={(e) => setEvent({ ...event, eventTime: e.target.value })}
              placeholder="e.g., 2:30 PM"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={event.eventDescription}
              onChange={(e) => setEvent({ ...event, eventDescription: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Location</label>
            <input
              type="text"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Update Event
          </button>
        </form>
      </div>
    </>
  );
};

export default EditEventPage;
