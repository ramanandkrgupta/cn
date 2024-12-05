import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/libs/prisma";
import jwt from "jsonwebtoken";

const productionUrl = process.env.NEXTAUTH_URL || 'https://www.notesmates.in';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
          prompt: "consent"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
          userRole: "FREE"
        }
      },
      credentials: {
        credential: { type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.credential) return null;

        try {
          const decoded = jwt.decode(credentials.credential);
          return {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            image: decoded.picture,
          };
        } catch (error) {
          console.error("Failed to decode Google credential:", error);
          return null;
        }
      }
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
          // console.error("Error during authorization:", error);
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
    signOut: "/",
    newUser: "/dashboard"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log("SignIn Callback - User:", user);
      // console.log("SignIn Callback - Account:", account);
      // console.log("SignIn Callback - Profile:", profile);
      
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
              accounts: true
            }
          });

          // console.log("Existing User:", existingUser);

          if (!existingUser) {
            // console.log("Creating new user for:", user.email);
            try {
              const newUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || '',
                  avatar: profile.picture || '',
                  phoneNumber: 'temp-' + Math.random().toString(36).substr(2, 9),
                  userRole: 'FREE',
                  password: await bcrypt.hash(Math.random().toString(36), 10),
                  isEmailVerified: true,
                  isMobileVerified: false,
                  reputationScore: 0,
                  uploadCount: 0,
                  verifiedUploads: 0,
                  accounts: {
                    create: {
                      type: account.type,
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      access_token: account.access_token,
                      token_type: account.token_type,
                      scope: account.scope,
                      id_token: account.id_token,
                    }
                  }
                },
              });
              // console.log("New user created:", newUser);
              return true;
            } catch (createError) {
              // console.error("Error creating new user:", createError);
              throw createError;
            }
          }

          // If user exists but no Google account linked
          if (!existingUser.accounts?.some(acc => acc.provider === 'google')) {
            // console.log("Linking Google account to existing user:", existingUser.id);
            if (!existingUser.avatar) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { avatar: profile.picture }
              });
            }
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            });
          }
          return true;
        } catch (error) {
          // console.error("Detailed Google sign-in error:", error);
          throw new Error(error.message);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.userRole = user.userRole;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token, user }) {
      if (session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            userRole: true,
            avatar: true
          }
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.userRole || "FREE";
          session.user.userRole = dbUser.userRole || "FREE";
          session.user.avatar = dbUser.avatar;
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Simplified redirect logic
      if (url.includes('/dashboard')) {
        return '/dashboard'  // Always redirect to dashboard directly
      }
      return baseUrl  // Default to base URL
    },
  },
  events: {
    async signOut({ token }) {
      // Clean up any necessary session data
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };