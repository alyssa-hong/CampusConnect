import { NextApiRequest, NextApiResponse } from "next";  // Import types
import NextAuth from "next-auth";
import { authConfig } from "@/auth"; // Import your auth config

// Properly type the parameters as NextApiRequest and NextApiResponse
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authConfig);
