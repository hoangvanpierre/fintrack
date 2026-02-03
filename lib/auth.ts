import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas/auth.schema"
import { TransactionType } from "@prisma/client"

const DEFAULT_CATEGORIES = [
  { name: 'Housing', type: 'EXPENSE', icon: 'home', color: '#ef4444' },
  { name: 'Food', type: 'EXPENSE', icon: 'utensils', color: '#f97316' },
  { name: 'Transport', type: 'EXPENSE', icon: 'car', color: '#eab308' },
  { name: 'Entertainment', type: 'EXPENSE', icon: 'clapperboard', color: '#8b5cf6' },
  { name: 'Salary', type: 'INCOME', icon: 'wallet', color: '#22c55e' },
  { name: 'Freelance', type: 'INCOME', icon: 'laptop', color: '#0ea5e9' },
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Credentials provider requires JWT strategy
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  events: {
    createUser: async ({ user }) => {
      // Only run for OAuth providers (Google) which create users via adapter automatically
      // Credentials users are created via register action which handles seeding manually
      // We check if account already exists to avoid double seeding if mixed
      if (!user.id) return;
      
      const count = await prisma.userAccount.count({ where: { userId: user.id }});
      if (count > 0) return;

      // 1. Create Default "Wallet" Account
      await prisma.userAccount.create({
        data: {
          name: "Wallet",
          type: "CASH",
          balance: 0,
          userId: user.id
        }
      });

      // 2. Create Default Categories
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          type: cat.type as TransactionType, 
          userId: user.id!
        }))
      });
      
      console.log(`✅ Seeded default data for user ${user.id}`);
    }
  },
  callbacks: {
    async session({ session, token }) {
      // With JWT strategy, user ID comes from token.sub
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
        return token;
    }
  },
})