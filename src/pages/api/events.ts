import mongoose from 'mongoose';
import Event from '@/models/events';
import connectMongoDB from '@/libs/mongodb';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        console.log('Connecting to MongoDB...');
        await connectMongoDB();
        console.log('Connected to MongoDB');
  
        const session = await getServerSession(req, res, authConfig);
        if (!session || !session.user?.email) {
          return res.status(401).json({ error: 'You must be logged in to create an event' });
        }
  
        const { eventName, eventDate, eventTime, eventDescription, eventImage, user, contactInfo } = req.body;
  
        console.log('Before saving event:', { eventName, eventDate, eventTime, eventDescription, eventImage, user, contactInfo });

  
        if (!eventName || !eventDate || !eventTime || !eventDescription || !user || !contactInfo) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
  
        const newEvent = new Event({
          eventName,
          eventDate,
          eventTime,
          eventDescription,
          eventImage,
          user,
          contactInfo,
        });
  
        await newEvent.save();
        console.log('Event saved successfully');
        return res.status(201).json({ message: 'Event created successfully', event: newEvent });
      } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).json({ error: 'Error creating event', details: error.message });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  