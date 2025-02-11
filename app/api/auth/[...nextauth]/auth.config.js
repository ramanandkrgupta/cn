import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";

// Add helper function at the top
const getRandomColor = () => {
    const colors = [
        '0088CC', // Blue
        '00A36C', // Green
        'CD5C5C', // Red
        'FFB347', // Orange
        '9370DB', // Purple
        '40E0D0', // Turquoise
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            throw new Error('Invalid email address!')
          }

          if (!user.password) {
            throw new Error('Please use Google login for this account')
          }

          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            throw new Error('Invalid password!')
          }

          return user
        } catch (error) {
          console.error('Authorization error:', error)
          throw error
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/account',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                avatar: profile.picture,
                userRole: 'FREE',
                password: await bcrypt.hash(Math.random().toString(36), 10),
                isEmailVerified: true,
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Get full user data including profile details
        const fullUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            name: true,
            userRole: true,
            avatar: true,
            isEmailVerified: true,
            isMobileVerified: true,
            reputationScore: true,
            uploadCount: true,
            verifiedUploads: true,
            university: true,
            college: true,
            level: true,
            stream: true,
            degree: true,
            specialization: true,
            year: true,
            semester: true,
            location: true,
            links: true,
          },
        })

        // Add all user data to token
        token = { ...token, ...fullUser }
      }

    //   if (trigger === 'update' && session?.user) {
    //     token.avatar = session.user.avatar


    //   }

    //   return token
    // },

    if (trigger === "update") {
      return { ...token, ...session.user };
    }
    return { ...token, ...user};
  },

    async session({ token, session }) {
      if (token) {
        // Add all user data to session
        session.user = {
          ...session.user,
          id: token.id,
          role: token.userRole,
          avatar: token.avatar,
          isEmailVerified: token.isEmailVerified,
          isMobileVerified: token.isMobileVerified,
          reputationScore: token.reputationScore,
          uploadCount: token.uploadCount,
          verifiedUploads: token.verifiedUploads,
          university: token.university,
          college: token.college,
          level: token.level,
          stream: token.stream,
          degree: token.degree,
          specialization: token.specialization,
          year: token.year,
          semester: token.semester,
          location: token.location,
          links: token.links,
        }
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
} 