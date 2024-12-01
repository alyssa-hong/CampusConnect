import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '@/libs/mongodb';
import Event from '@/models/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      return res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof Error) {
        return res.status(500).json({ error: 'Error creating event', details: error.message });
      }
      return res.status(500).json({ error: 'Unknown error occurred while creating event.' });
    }
  } else if (req.method === 'GET') {
    try {
      await connectMongoDB();
      const events = await Event.find({});
      return res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error instanceof Error) {
        return res.status(500).json({ error: 'Error fetching events', details: error.message });
      }
      return res.status(500).json({ error: 'Unknown error occurred while fetching events.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
