"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TransactionSchema } from "@/schemas/transaction.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransaction(formData: any) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = TransactionSchema.safeParse(formData);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { amount, description, date, categoryId, accountId, type } = result.data;

  // Transaction Logic:
  // 1. Create Transaction
  // 2. Update Account Balance (Atomic Transaction)

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create
      await tx.transaction.create({
        data: {
          amount,
          description,
          date,
          type,
          categoryId,
          accountId,
          userId: session.user.id
        }
      });

      // 2. Update Balance
      const balanceChange = type === 'INCOME' ? amount : -amount;
      
      await tx.userAccount.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: balanceChange
          }
        }
      });
    });

    revalidatePath("/dashboard");
    return { success: true };
    
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { error: "Failed to create transaction" };
  }
}
