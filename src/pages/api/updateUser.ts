import { getServerSession } from 'next-auth/next';  
import connectMongoDB from '@/libs/mongodb'; 
import User from '@/models/user'; 
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Ensure the request context is correctly passed
  const session = await getServerSession(req, res);

  // Check if the user is authenticated
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Only allow POST requests for updating user data
  if (req.method === 'POST') {
    const { firstName, lastName, userName, password } = req.body;

    try {
      // Connect to the database
      await connectMongoDB();  // Make sure to connect to MongoDB

      // Find the user by email
      const user = await User.findOne({ email: session.user.email });

      // Log the user to see if it is found
      console.log('Fetched User:', user);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prepare the data to be updated
      const updatedData: any = {
        firstName,
        lastName,
        userName,
      };

      // Only update the password if it's provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      }

      // Update the user data in the database
      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { $set: updatedData },
        { new: true } // This option returns the modified document
      );

      if (!updatedUser) {
        return res.status(400).json({ message: 'Failed to update user' });
      }

      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    // If the method is not POST, return a 405 error (Method Not Allowed)
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}