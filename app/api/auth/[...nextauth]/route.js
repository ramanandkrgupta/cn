import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

import prisma from "@/libs/prisma";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    // Credentials Provider
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findFirst({
            where: { email: email },
          });

          if (user) {
            // Check password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
              return user;
            } else {
              throw new Error("Invalid password!");
            }
          } else {
            throw new Error("Invalid email address!");
          }
        } catch (error) {
          console.error("Error processing the request:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
async signIn({ user, account, profile, email }) {
      try {
        // Check if the user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });

        if (existingUser) {
          // User exists, proceed with sign-in
          return true;
        } else {
          // User doesn't exist, create a new user account
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || profile.login,
              
            },
          });

          // After creating the user, proceed with sign-in
          return true;
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.userRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };