import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventImage: { type: String }, // Store file path or URL
  user: { type: String, required: true },
  contactInfo: { type: String, required: true },
  location: { type: String, required: true }, // New field added for location
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
