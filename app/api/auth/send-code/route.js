// /app/api/auth/[...nextauth]/auth.config.js

import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/libs/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email: email }
          });

          if (!user) {
            throw new Error("Invalid email address!");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("Invalid password!");
          }

          return user;
        } catch (error) {
          console.error("Authorization error:", error);
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
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback:", { user, account: account?.provider });

      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                avatar: profile.picture,
                userRole: "FREE",
                password: await bcrypt.hash(Math.random().toString(36), 10),
                isEmailVerified: true
              },
            });
            console.log("Created new user:", newUser.email);
          }
          return true;
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      console.log("JWT Callback:", { tokenEmail: token.email, userId: user?.id });

      if (user) {
        token.role = user.userRole;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Session Callback:", {
        sessionEmail: session?.user?.email,
        tokenId: token.id
      });

      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback:", { url, baseUrl });

      // If it's a callback URL with auth parameters
      if (url.includes('/api/auth/callback') || url.includes('state=')) {
        console.log("Processing callback, redirecting to account");
        return `${baseUrl}/account`;
      }

      // If it's an absolute URL on our domain
      if (url.startsWith(baseUrl)) {
        console.log("Using provided URL:", url);
        return url;
      }

      // If it's a relative URL
      if (url.startsWith('/')) {
        console.log("Converting relative URL:", url);
        return `${baseUrl}${url}`;
      }

      // Default fallback
      console.log("Using default redirect to account");
      return `${baseUrl}/account`;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };