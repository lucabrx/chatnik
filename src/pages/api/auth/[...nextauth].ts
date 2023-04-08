import { authOptions } from "@/utils/auth";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions)