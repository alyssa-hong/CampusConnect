import User from '@/models/user';
import connectMongoDB from '@/libs/mongodb';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, userName } = req.body;

    try {
      // Ensure the database is connected
      await connectMongoDB();

      // Check if the email or username already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { userName }],
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'Email or Username already exists. Please use a different one.',
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, // Save the hashed password
        userName,
      });

      // Save the user to the database
      await user.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        error: 'An unexpected error occurred while creating the user.',
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
