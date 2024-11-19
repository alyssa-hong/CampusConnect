import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/AddEvents.css';

const AddEventPage: React.FC = () => {
  const [eventImage, setEventImage] = useState<File | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null); 
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      setImagePreview(URL.createObjectURL(file)); // Temporary URL for preview
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('eventDate', eventDate);
    formData.append('eventTime', eventTime);
    formData.append('eventDescription', eventDescription);
    formData.append('submitterName', submitterName);
    formData.append('contactInfo', contactInfo);
    if (eventImage) {
      formData.append('eventImage', eventImage);
    }

    console.log('Event Added:', {
      eventImage,
      eventName,
      eventDate,
      eventTime,
      eventDescription,
      submitterName,
      contactInfo,
    });

    // Redirect user back to home after form submission
    router.push('/home');
  };

  return (
    <div className="add-event-page">
      <h1>Add New Event</h1>
      <form onSubmit={handleSubmit} className="event-form" encType="multipart/form-data">

      
        {/* Image Upload Field */}
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

        {/* Event Name Field */}
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        {/* Event Date Field */}
        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        {/* Event Time Field */}
        <div className="form-group">
          <label>Event Time</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </div>

        {/* Event Description Field */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>

        {/* Submitter Name Field */}
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            required
          />
        </div>

        {/* Contact Info Field */}
        <div className="form-group">
          <label>Contact Information</label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Email or phone number"
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Event</button>
      </form>
    </div>
  );
};

export default AddEventPage;
