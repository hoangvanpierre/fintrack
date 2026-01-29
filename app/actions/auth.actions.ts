"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/schemas/auth.schema";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Seed Data (Same as Google Auth event, but manual here)
  await seedNewUser(user.id);

  return { success: "User created!" };
};

// Helper to seed data
async function seedNewUser(userId: string) {
    const DEFAULT_CATEGORIES = [
        { name: 'Housing', type: 'EXPENSE', icon: 'home', color: '#ef4444' },
        { name: 'Food', type: 'EXPENSE', icon: 'utensils', color: '#f97316' },
        { name: 'Transport', type: 'EXPENSE', icon: 'car', color: '#eab308' },
        { name: 'Entertainment', type: 'EXPENSE', icon: 'clapperboard', color: '#8b5cf6' },
        { name: 'Salary', type: 'INCOME', icon: 'wallet', color: '#22c55e' },
        { name: 'Freelance', type: 'INCOME', icon: 'laptop', color: '#0ea5e9' },
    ];

    await prisma.userAccount.create({
        data: {
            name: "Wallet",
            type: "CASH",
            balance: 0,
            userId: userId
        }
    });

    await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            // @ts-ignore
            type: cat.type, 
            userId: userId
        }))
    });
}
