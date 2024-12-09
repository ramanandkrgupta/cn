import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/libs/prisma";

// Add this before authOptions to verify Prisma connection
const verifyPrismaConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully");
  } catch (error) {
    console.error("Prisma connection error:", error);
  }
};

verifyPrismaConnection();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

console.log("Database URL:", process.env.DATABASE_URL);

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',

  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    //  httpOptions: {
    //     timeout: 10000 // 10 seconds
    //   }
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      httpOptions: {
        timeout: 10000 // 10 seconds
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

  httpOptions: {
    timeout: 10000
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          // First check if user exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true }
          });

          if (!existingUser) {
            // Create new user with account
            try {
              const newUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || profile.name || profile.login,
                  avatar: profile.picture || user.image,
                  userRole: "FREE",
                  isEmailVerified: true,
                  password: await bcrypt.hash(Math.random().toString(36), 10)
                }
              });

              // Create account for new user
              await prisma.account.create({
                data: {
                  userId: newUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                }
              });

              return true;
            } catch (error) {
              console.error("Error creating new user:", error);
              return false;
            }
          } else {
            // Update existing user's avatar if it's missing
            if (!existingUser.avatar && (profile.picture || user.image)) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  avatar: profile.picture || user.image
                }
              });
            }

            // User exists, allow sign in with same email
            if (existingUser.accounts.length === 0) {
              // No accounts linked yet, create one
              try {
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
              } catch (error) {
                console.error("Error linking account:", error);
              }
            }
            return true; // Allow sign in with existing account
          }
        }
        return true; // Allow other sign in methods
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      console.log("\n==================== JWT CALLBACK ====================");
      if (user) {
        token.id = user.id;
        token.role = user.userRole || "FREE";
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar || user.image;
        token.phoneNumber = user.phoneNumber || null;
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("\n==================== SESSION CALLBACK ====================");
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          provider: token.provider,
          avatar: token.avatar || session.user.image,
          name: token.name || session.user.name,
          phoneNumber: token.phoneNumber
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("\n==================== REDIRECT CALLBACK ====================");
      console.log("Redirect:", { url, baseUrl });

      // Handle OAuth callbacks
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
    },
    async error(message) {
      console.error("\n==================== AUTH ERROR ====================");
      console.error("Auth Error:", message);
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
