import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb';
import Event from '../../models/events'; // Assuming you have an event model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body; // Get the event ID from the request body

      if (!id) {
        return res.status(400).json({ error: 'Event ID is required to delete an event.' });
      }

      // Connect to MongoDB
      await connectMongoDB();

      // Delete the event by its ID
      const deletedEvent = await Event.findByIdAndDelete(id);

      if (!deletedEvent) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Return success response
      return res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}
