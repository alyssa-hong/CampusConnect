import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../../src/libs/mongodb';
import User from '../../../src/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userName, password } = req.body;

      // Check if username or password is missing
      if (!userName || !password) {
        return res.status(400).json({ error: 'Both userName and password are required.' });
      }

      // Connect to MongoDB
      await connectMongoDB();

      // Look for the user in the database with matching username and password
      const user = await User.findOne({ userName, password });

      // If no user is found, return an error
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // If login is successful, return the user info
      return res.status(200).json({ message: 'Login successful.', user: { userName: user.userName, email: user.email } });
    } catch (error: any) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
  } else {
    // If the method is not POST, return a 405 error
    return res.status(405).json({ message: 'This endpoint only supports POST requests for user login.' });
  }
}
