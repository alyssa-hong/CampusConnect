// /pages/api/eventsByUsername.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb';
import Event from '../../models/events'; // Assuming you have an event model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { username } = req.query; // Use username to find events related to the user

      if (!username) {
        return res.status(400).json({ error: 'Username is required to fetch events.' });
      }

      // Connect to MongoDB
      await connectMongoDB();

      // Find all events associated with this username (using the 'user' field in your collection)
      const events = await Event.find({ user: username }).lean(); // Updated to use 'user' instead of 'userName'

      if (!events || events.length === 0) {
        return res.status(404).json({ error: 'No events found for this user.' });
      }

      // Return the list of events
      return res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}
