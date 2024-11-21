import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/AddEvents.css';

const AddEventPage: React.FC = () => {
  const { data: session } = useSession(); // Access session here
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventTimeAMPM, setEventTimeAMPM] = useState<'AM' | 'PM'>('AM'); // AM/PM state
  const [eventDescription, setEventDescription] = useState('');
  const [userName, setUserName] = useState<string | null>(null); // Store username
  const [contactInfo, setContactInfo] = useState<string>(''); // Autofill with email

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserName = async () => {
        try {
          const res = await fetch(`/api/getUser?email=${session.user.email}`);
          if (res.ok) {
            const data = await res.json();
            setUserName(data.userName);
            setContactInfo(session.user.email);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserName();
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventTime(e.target.value);
  };

  const handleAMPMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventTimeAMPM(e.target.value as 'AM' | 'PM');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email || !userName) {
      alert('You must be logged in to create an event.');
      return;
    }

    const formData = {
      eventName,
      eventDate,
      eventTime: `${eventTime} ${eventTimeAMPM}`, // Include AM/PM with the time
      eventDescription,
      eventImage,
      user: userName,
      contactInfo,
    };

    console.log('Submitting event data:', formData);

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/home');
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error || 'Error adding event.'}`);
    }
  };

  return (
    <div className="add-event-page">
      <h1>Add New Event</h1>
      <form onSubmit={handleSubmit} className="event-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Event Image</label>
          <div className="image-upload">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Event Preview" />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => {
                    setEventImage(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <label htmlFor="eventImage" className="upload-label">
                  Click to upload an image
                </label>
                <input
                  id="eventImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-input"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Time</label>
          <div className="time-picker">
            <input
              type="time"
              value={eventTime}
              onChange={handleTimeChange}
              required
            />
            <select
              value={eventTimeAMPM}
              onChange={handleAMPMChange}
              className="ampm-select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Info</label>
          <input
            type="text"
            value={contactInfo}
            required
            readOnly
          />
        </div>

        <button type="submit" className="submit-button">Submit Event</button>
      </form>
    </div>
  );
};

export default AddEventPage;
