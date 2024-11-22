// pages/api/updateEvent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb'; // MongoDB connection utility
import Event from '../../models/events'; // Assuming you have an Event model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, updatedEvent } = req.body; // Extract the event ID and updated data from the request body

    if (!id || !updatedEvent) {
      return res.status(400).json({ error: 'Event ID and updated event data are required.' });
    }

    try {
      // Connect to MongoDB
      await connectMongoDB();

      // Update the event by its ID with the updated data
      const updated = await Event.findByIdAndUpdate(id, updatedEvent, { new: true });

      if (!updated) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      // Return the updated event data
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ error: 'Error updating event.' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // Return method not allowed for non-PUT requests
  }
}
