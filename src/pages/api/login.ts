import { NextApiRequest, NextApiResponse } from 'next';
import connectMongoDB from '../../libs/mongodb';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key'; // Make sure to set this in .env.local

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

      // Look for the user in the database with matching username
      const user = await User.findOne({ userName });

      // If no user is found, return an error
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If the password is incorrect, return an error
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Create a JWT token with the userId (use the user's _id)
      const token = jwt.sign(
        { userId: user._id },
        SECRET_KEY, // Secret key for encoding
        { expiresIn: '1h' } // Expiration time (can be adjusted as needed)
      );

      // Set the JWT as a cookie (using the 'HttpOnly' flag to make it secure)
      res.setHeader('Set-Cookie', [
        `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600` // Secure for HTTPS
      ]);

      // If login is successful, return the user info
      return res.status(200).json({
        message: 'Login successful.',
        user: { userName: user.userName, email: user.email },
      });
    } catch (error: unknown) {
      console.error('Error during login:', error);

      // Type assertion: assert the error is an instance of Error
      if (error instanceof Error) {
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
      }

      // Handle case where the error is not an instance of Error
      return res.status(500).json({ error: 'Internal server error.', details: 'An unknown error occurred.' });
    }
  } else {
    // Handle unsupported HTTP methods (e.g., GET requests)
    return res.status(405).json({ error: 'Method not allowed. This endpoint only supports POST requests.' });
  }
}
