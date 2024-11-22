import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Import signOut
import { useRouter } from 'next/router';
import Header from '../components/Header/Header'; // Import Header component
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
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null); // Store the GridFS fileId
  const [isAuthorized, setIsAuthorized] = useState(true); // Track authorization state
  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent mismatch

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
          setIsLoading(false); // Stop loading once data is fetched
        }
      };
      fetchUserName();
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file); // Store the file in state
      setImagePreview(URL.createObjectURL(file)); // Preview the image immediately
    } else {
      setEventImage(null);
      setImagePreview(null);
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
  
    // Ensure that the time input matches the selected AM/PM
    const [hour, minute] = eventTime.split(":").map((str) => parseInt(str, 10));
  
    // If the hour is invalid for AM/PM (e.g., trying to set 13:00 for AM)
    if ((eventTimeAMPM === 'AM' && hour >= 12) || (eventTimeAMPM === 'PM' && hour === 12)) {
      alert('The hour does not match the selected AM/PM.');
      return;
    }
  
    // Check if the user is logged in
    if (!session?.user?.email || !userName) {
      alert('You must be logged in to create an event.');
      return;
    }
  
    let uploadedImagePath = null;
  
    // If there's an image, handle the upload
    if (eventImage) {
      const formData = new FormData();
      formData.append('eventImage', eventImage);
  
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error('Upload failed:', errorData);  // Log the error
        alert('Image upload failed: ' + errorData.error);
        return;
      }
  
      const data = await uploadRes.json();
      uploadedImagePath = data.fileId; // Assuming the response includes the file ID
    }
  
    // Send the event details (including the image path) to the backend
    const eventData = {
      eventName,
      eventDate,
      eventTime: `${eventTime}:${eventTimeAMPM}`,
      eventDescription,
      eventImage: uploadedImageId, // Include GridFS file ID here
      user: userName,
      contactInfo,
    };
  
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
  
    if (res.ok) {
      router.push('/home'); // Redirect to home page after success
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error || 'Error adding event.'}`);
    }
  };
  
  // Handle logout
  const logout = async () => {
    setIsAuthorized(false);
    await signOut({ callbackUrl: '/' }); // Log out and redirect to home page
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while data is being fetched
  }

  return (
    <div className="add-event-page">
      {/* Include Header component */}
      <Header 
        setIsAuthorized={setIsAuthorized} 
        isAuthorized={isAuthorized} 
        logout={logout} 
      />

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
