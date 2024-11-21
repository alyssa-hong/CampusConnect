import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from './models/user';
import connectMongoDB from './libs/mongodb';

export const authConfig = {
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

          const user = await User.findOne({ email: credentials.email }).lean();
          if (!user) {
            console.log('User not found for email:', credentials.email);
            return null;
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password);

          if (isMatch) {
            
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.userName, // Use 'userName' based on your MongoDB schema
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
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.userName = user.userName;  // Store 'userName' in the token (consistent with schema)
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.userName;  // Use 'userName' in the session (consistent with schema)
      return session;
    },
  },
};
