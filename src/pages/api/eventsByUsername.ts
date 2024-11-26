import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb';
import Event from '../../models/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query; // Use email (session.user.email) to find events

      if (!email) {
        return res.status(400).json({ error: 'Email is required to fetch events.' });
      }

      // Connect to MongoDB
      await connectMongoDB();

      // Find all events associated with this email (using the 'contactInfo' field)
      const events = await Event.find({ contactInfo: email }).lean();

      if (!events || events.length === 0) {
        return res.status(404).json({ error: 'No events found for this email.' });
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
