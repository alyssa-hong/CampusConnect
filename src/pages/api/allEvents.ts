// pages/api/events.ts
import connectMongoDB from '@/libs/mongodb'; // Your MongoDB connection helper
import Event from '@/models/events'; // Your Event model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectMongoDB();

      // Fetch all events from the database
      const events = await Event.find({});
      return res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Error fetching events', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
