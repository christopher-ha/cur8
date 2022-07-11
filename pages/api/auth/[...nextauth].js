import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
import customVerificationRequest from "@/utils/customVerificationRequest";
import { prisma } from "@/utils/db";

// Instantiate Prisma Client
// const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic links are valid for 10 min only
      sendVerificationRequest: customVerificationRequest,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: user,
      };
    },
  },
  adapter: PrismaAdapter(prisma),
});
