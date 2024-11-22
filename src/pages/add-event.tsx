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
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventTime(e.target.value);
  };

  const convertTo24HourFormat = (time: string) => {
    const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
    const match = time.match(regex);

    if (match) {
      let [_, hour, minute, period] = match;
      hour = parseInt(hour);
      minute = parseInt(minute);

      if (period === 'PM' && hour !== 12) {
        hour += 12; // Convert PM hours to 24-hour format
      } else if (period === 'AM' && hour === 12) {
        hour = 0; // Convert 12 AM to 00
      }

      return `${hour}:${minute < 10 ? '0' + minute : minute}`; // Return the formatted time
    } else {
      return ''; // Return an empty string if the format is incorrect
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the event time is in the correct format and contains AM/PM
    const formattedTime = convertTo24HourFormat(eventTime);
    if (!formattedTime) {
      alert('Please enter a valid time in the format "hh:mm AM/PM".');
      return;
    }

    if (!session?.user?.email || !userName) {
      alert('You must be logged in to create an event.');
      return;
    }

    let uploadedImagePath = null;

    if (eventImage) {
      const formData = new FormData();
      formData.append('eventImage', eventImage);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error('Upload failed:', errorData);
        alert('Image upload failed: ' + errorData.error);
        return;
      }

      const data = await uploadRes.json();
      uploadedImagePath = data.fileId;
    }

    const eventData = {
      eventName,
      eventDate,
      eventTime, // Keep the original AM/PM format here for display
      eventTime24: formattedTime, // Store the 24-hour format for processing or display purposes
      eventDescription,
      eventImage: uploadedImageId,
      user: userName,
      contactInfo,
      location,
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      router.push('/home');
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error || 'Error adding event.'}`);
    }
  };

  const logout = async () => {
    setIsAuthorized(false);
    await signOut({ callbackUrl: '/' });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-event-page">
      <Header setIsAuthorized={setIsAuthorized} isAuthorized={isAuthorized} logout={logout} />

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
          <label>Event Time (hh:mm AM/PM)</label>
          <input
            type="text"
            value={eventTime}
            onChange={handleTimeChange}
            required
            placeholder="Enter time in format hh:mm AM/PM"
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
            required
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
  );
};

export default AddEventPage;
