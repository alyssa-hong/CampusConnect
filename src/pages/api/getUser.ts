// pages/api/getUser.ts (or .js)
import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb';
import User from '../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: 'Email is required to fetch user data.' });
      }

      // Connect to MongoDB
      await connectMongoDB();

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Return the user's data
      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}
