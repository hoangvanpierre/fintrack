import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas/auth.schema"
import { TransactionType } from "@prisma/client"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"

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
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers.filter(p => p.id !== 'credentials'),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
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
  events: {
    createUser: async ({ user }) => {
      if (!user.id) return;
      
      const count = await prisma.userAccount.count({ where: { userId: user.id }});
      if (count > 0) return;

      await prisma.userAccount.create({
        data: {
          name: "Wallet",
          type: "CASH",
          balance: 0,
          userId: user.id
        }
      });

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
})