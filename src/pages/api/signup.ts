import User from '@/models/user';
import connectMongoDB from '@/libs/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, userName } = req.body;

    try {
      // Ensure the database is connected
      await connectMongoDB();

      // Create the new user with firstName and lastName (no need to hash the password)
      const user = new User({
        firstName,
        lastName,
        email,
        password,  // Store the password as plain text, it'll be hashed automatically by pre('save')
        userName,
      });

      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user: ', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
