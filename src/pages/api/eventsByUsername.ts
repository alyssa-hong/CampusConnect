import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb';
import Event from '../../models/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      console.log('Received email:', email); // Debugging log

      if (!email || typeof email !== 'string') {
        console.error('Invalid or missing email');
        return res.status(400).json({ error: 'Valid email is required to fetch user events.' });
      }

      await connectMongoDB();
      console.log('Connected to MongoDB'); // Debugging log

      const events = await Event.find({ contactInfo: email }).lean();
      console.log('Fetched user events:', events); // Debugging log

      if (!events || events.length === 0) {
        console.warn(`No events found for email: ${email}`);
        return res.status(404).json({ error: 'No events found for this user.' });
      }

      return res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching user events:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
