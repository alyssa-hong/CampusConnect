// pages/api/events.ts
import connectMongoDB from '@/libs/mongodb';
import Event from '@/models/events';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectMongoDB();

      // Extract query parameters for filtering, sorting, and pagination
      const { user, sort, limit = 10, skip = 0 } = req.query;

      // Build the query object for filtering
      const query = {};
      if (user) {
        query.user = user;
      }

      // Convert limit and skip to numbers
      const limitNum = parseInt(limit as string, 10);
      const skipNum = parseInt(skip as string, 10);

      // Fetch events with filtering, sorting, and pagination
      const events = await Event.find(query)
        .sort(sort ? { [sort]: 1 } : { eventDate: 1 }) // Default sorting by eventDate
        .limit(limitNum)
        .skip(skipNum);

      // Get total event count
      const totalEvents = await Event.countDocuments(query);

      // Send response with metadata
      return res.status(200).json({
        events,
        metadata: {
          total: totalEvents,
          limit: limitNum,
          skip: skipNum,
          fetched: events.length,
        },
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Error fetching events', details: error.message });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
