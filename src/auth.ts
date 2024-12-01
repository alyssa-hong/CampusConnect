import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from './models/user';
import connectMongoDB from './libs/mongodb';
import { ObjectId } from 'mongodb';
import { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt'; 

interface CustomUser {
  _id: ObjectId;
  id: string;
  email: string;
  password: string;
  userName: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    userName: string;
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          // Ensure MongoDB is connected
          await connectMongoDB();

          // Find the user in the database
          const user = await User.findOne({ email: credentials.email }).lean() as CustomUser | null;

          if (!user) {
            console.log('User not found for email:', credentials.email);
            return null;
          }

          // Compare hashed passwords
          const isMatch = await bcrypt.compare(credentials.password, user.password);

          if (isMatch) {
            return {
              id: user._id.toString(), 
              email: user.email,
              name: user.userName, // Use userName from schema
            };
          } else {
            console.log('Incorrect password');
            return null;
          }
        } catch (error) {
          console.error('An error occurred: ', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || ''; // Map user.id to token.id
        token.email = user.email || ''; // Map user.email to token.email
        token.userName = user.name || ''; // Map user.name to token.userName
      }
      console.log('JWT Callback Token:', token); // Debugging
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id || '', 
        email: token.email || '', 
        name: token.userName || '', 
      };
      console.log('Session Callback:', session); // Debugging
      return session;
    },
  },
};
