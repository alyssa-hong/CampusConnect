import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventImage: { type: String }, // Assuming image is stored as a string (URL or base64)
  user: { type: String, required: true }, // User who created the event
  contactInfo: { type: String, required: true }, // This field should be of type String
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
