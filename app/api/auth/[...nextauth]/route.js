import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"; // Add this line
import prisma from "@/libs/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({ // Add this block
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              userRole: true,
              avatar: true
            }
          });

          if (!user) {
            throw new Error("No user found with this email!");
          }

          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password!");
          }

          // Return user data without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.userRole, // For backward compatibility
            userRole: user.userRole,
            avatar: user.avatar
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed!");
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
    async signIn({ user, account }) {
      if (account.provider === "github" || account.provider === "google") { // Add google to the condition
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.login,
                image: user.image || user.avatar_url,
                phoneNumber: '',
                userRole: 'FREE',
                password: await bcrypt.hash(Math.random().toString(36), 10)
              },
            });
          }
          return true;
        } catch (error) {
          console.error(`Error during ${account.provider} sign-in:`, error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.role = user.userRole;
        token.userRole = user.userRole;
      }

      // Handle session update
      if (trigger === "update" && session?.user) {
        token.role = session.user.role;
        token.userRole = session.user.userRole;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.userRole = token.userRole;
      }
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      // Clean up any necessary session data
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };