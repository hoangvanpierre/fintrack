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

export async function deleteTransaction(transactionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get the transaction to be deleted
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId, userId: session.user.id }
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // 2. Reverse the balance impact
      // If it was an INCOME (added money), we subtract it.
      // If it was an EXPENSE (subtracted money), we add it back.
      const reverseAmount = transaction.type === 'INCOME' 
        ? -transaction.amount.toNumber() 
        : transaction.amount.toNumber();

      await tx.userAccount.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: reverseAmount
          }
        }
      });

      // 3. Delete the transaction
      await tx.transaction.delete({
        where: { id: transactionId }
      });
    });

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return { error: "Failed to delete transaction" };
  }
}

export async function updateTransaction(transactionId: string, formData: any) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = TransactionSchema.safeParse(formData);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const { amount, description, date, categoryId, accountId, type } = result.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get the original transaction
      const existingTransaction = await tx.transaction.findUnique({
        where: { id: transactionId, userId: session.user.id }
      });

      if (!existingTransaction) {
        throw new Error("Transaction not found");
      }

      // 2. Revert the old balance on the OLD account
      const oldReverseAmount = existingTransaction.type === 'INCOME'
        ? -existingTransaction.amount.toNumber()
        : existingTransaction.amount.toNumber();

      await tx.userAccount.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: oldReverseAmount
          }
        }
      });

      // 3. Apply the NEW balance on the NEW account
      // (Even if accountId is the same, we treated the reversion above, so we just add the new impact now)
      const newImpactAmount = type === 'INCOME' ? amount : -amount;

      await tx.userAccount.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: newImpactAmount
          }
        }
      });

      // 4. Update the transaction record
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          amount,
          description,
          date,
          type,
          categoryId,
          accountId,
        }
      });
    });

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Failed to update transaction:", error);
    return { error: "Failed to update transaction" };
  }
}
