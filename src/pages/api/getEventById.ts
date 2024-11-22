// pages/api/getEventById.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb'; // Import MongoDB connection utility
import Event from '../../models/events'; // Assuming you have an Event model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query; // Get the event ID from the query parameter

    if (!id) {
      return res.status(400).json({ error: 'Event ID is required.' });
    }

    try {
      // Connect to MongoDB
      await connectMongoDB();

      // Fetch the event by its ID
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Return the event data
      return res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' }); // Return method not allowed for non-GET requests
  }
}
