import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventImage: { type: String }, 
  user: { type: String, required: true },
  contactInfo: { type: String, required: true },
  location: { type: String, required: true }, 
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
