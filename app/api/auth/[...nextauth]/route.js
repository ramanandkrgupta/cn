import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/libs/prisma";

export const authOptions = {
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
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            throw new Error("No user found with this email!");
          }

          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password!");
          }

          // Include phoneNumber and userRole in the returned user object
          return {
            ...user,
            phoneNumber: user.phoneNumber,
            userRole: user.userRole,
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
      if (account.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create a new user if not already in the database
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.login,
                image: user.image || user.avatar_url, // Store GitHub avatar
                phoneNumber: user.phoneNumber || '', // Default to empty string if not provided
                userRole: user.userRole || 'user', // Default role
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error during GitHub sign-in:", error);
          return false;
        }
      }

      // For credentials provider, simply allow sign-in to proceed
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.userRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };