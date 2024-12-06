import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/libs/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
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
          console.log("Authorizing credentials for:", email);
          
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user) {
            console.log("User not found:", email);
            throw new Error("Invalid email address!");
          }

          if (!user.password) {
            console.log("No password set for user:", email);
            throw new Error("Please use Google login for this account");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            console.log("Password mismatch for:", email);
            throw new Error("Invalid password!");
          }

          console.log("Successfully authorized:", email);
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/account"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("\n==================== AUTH DATA ====================");
      console.log("\n1. Raw User Data:", JSON.stringify(user, null, 2));
      console.log("\n2. Raw Account Data:", JSON.stringify(account, null, 2));
      console.log("\n3. Raw Profile Data:", JSON.stringify(profile, null, 2));
      
      try {
        if (account?.provider === "github" || account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                avatar: account.provider === "github" ? profile.avatar_url : profile.picture,
                userRole: "FREE",
                isEmailVerified: true,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                  }
                }
              }
            });
            console.log(`New ${account.provider} user created:`, user.email);
          } else {
            const existingAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider
            );

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                }
              });
              console.log(`Linked ${account.provider} to existing user:`, user.email);
            }
          }
          return true;
        }
        return true;
      } catch (error) {
        console.error("\nError in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.userRole || "FREE";
        token.email = user.email;
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          provider: token.provider
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("\n==================== REDIRECT CALLBACK ====================");
      console.log("URL:", url);
      console.log("Base URL:", baseUrl);

      // Handle callback URLs
      if (url.includes('/api/auth/callback') || url.includes('state=')) {
        return `${baseUrl}/account`;
      }

      // Handle other URLs
      return url.startsWith(baseUrl) ? url : `${baseUrl}/account`;
    },
  },

  events: {
    async signIn(message) {
      console.log("\n==================== SIGN IN EVENT ====================");
      console.log("Sign In Event:", JSON.stringify(message, null, 2));
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 