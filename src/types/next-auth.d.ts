// src/types/next-auth.d.ts
import NextAuth from 'next-auth';
import { User as AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface User extends AdapterUser {
    userName: string;
    email: string;
    id: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    userName: string;
    email: string;
    id: string;
  }
}
