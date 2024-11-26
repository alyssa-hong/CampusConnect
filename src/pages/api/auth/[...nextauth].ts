import { NextApiRequest, NextApiResponse } from "next";  
import NextAuth from "next-auth";
import { authConfig } from "@/auth"; 

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authConfig);
