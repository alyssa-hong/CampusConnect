import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '@/libs/mongodb';
import Event from '@/models/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectMongoDB();

      // Fetch all events
      const events = await Event.find({}).lean();

      return res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching all events:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
