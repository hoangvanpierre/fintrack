"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AccountSchema } from "@/schemas/account.schema";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: any) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = AccountSchema.safeParse(formData);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { name, type, balance } = result.data;

  try {
    await prisma.userAccount.create({
      data: {
        name,
        type,
        balance,
        userId: session.user.id
      }
    });

    revalidatePath("/dashboard/accounts");
    revalidatePath("/dashboard"); // Update dashboard total balance
    return { success: true };
    
  } catch (error) {
    console.error("Failed to create account:", error);
    return { error: "Failed to create account" };
  }
}
