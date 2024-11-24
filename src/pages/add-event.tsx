import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header/Header';
import '../styles/AddEvents.css';

const AddEventPage: React.FC = () => {
  const { data: session } = useSession();
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<string>('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        } finally {
          setIsLoading(false);
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
    } else {
      setEventImage(null);
      setImagePreview(null);
    }
  };

  const convertTo24HourFormat = (time: string) => {
    const regex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = time.trim().match(regex);

    if (!match) {
      throw new Error('Invalid time format. Please use hh:mm AM/PM.');
    }

    let [_, hour, minute, period] = match;
    hour = parseInt(hour, 10);

    if (period.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12; // Convert PM to 24-hour format
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0; // Convert 12 AM to 00
    }

    return `${hour.toString().padStart(2, '0')}:${minute}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if image is uploaded
      if (!eventImage) {
        alert('Please upload an image for the event.');
        return;
      }

      const formattedTime = convertTo24HourFormat(eventTime);

      let uploadedImagePath = null;
      const formData = new FormData();
      formData.append('eventImage', eventImage);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(`Image upload failed: ${errorData.error}`);
      }

      const { filePath } = await uploadRes.json();
      uploadedImagePath = filePath;

      const eventData = {
        eventName,
        eventDate,
        eventTime,
        eventTime24: formattedTime,
        eventDescription,
        eventImage: uploadedImagePath,
        user: userName,
        contactInfo,
        location,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create event.');
      }

      router.push('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Header isAuthorized={!!session?.user} logout={logout} />
    <div className="add-event-page">
      <form onSubmit={handleSubmit} className="event-form">
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
          <label>Event Time (hh:mm AM/PM)</label>
          <input
            type="text"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
            placeholder="e.g., 2:30 PM"
            pattern="^([1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$"
            title="Please enter a valid time in the format hh:mm AM/PM (e.g., 2:30 PM)"
          />
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
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Event</button>
      </form>
    </div>
    </>
  );
};

export default AddEventPage;
