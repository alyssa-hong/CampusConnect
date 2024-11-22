// pages/api/events.js
import connectMongoDB from '@/libs/mongodb';
import Event from '@/models/events';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectMongoDB();

      const { eventName, eventDate, eventTime, eventDescription, eventImage, user, contactInfo, location } = req.body;

      // Check if all required fields are provided
      if (!eventImage) {
        return res.status(400).json({ error: 'Event image is required.' });
      }

      const newEvent = new Event({
        eventName,
        eventDate,
        eventTime,
        eventDescription,
        eventImage,
        user,
        contactInfo,
        location,
      });

      await newEvent.save();
      res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
      res.status(500).json({ error: 'Error creating event', details: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const events = await Event.find({});
      res.status(200).json({ events });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching events', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
