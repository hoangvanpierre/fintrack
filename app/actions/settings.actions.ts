"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCurrency(currency: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
        where: { id: session.user.id },
        data: { currency }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
    
  } catch (error) {
    console.error("Failed to update currency:", error);
    return { error: "Failed to update currency" };
  }
}

export async function updateProfile(formData: { name: string; financialGoal: string; imageUrl?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: formData.name,
        financialGoal: formData.financialGoal,
        ...(formData.imageUrl && { image: formData.imageUrl })
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function updateBudget(amount: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        monthlyBudget: amount 
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update budget:", error);
    return { error: "Failed to update budget" };
  }
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.delete({
      where: { id: session.user.id }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { error: "Failed to delete account" };
  }
}

export async function saveTheme(theme: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
        where: { id: session.user.id },
        data: { theme }
    });

    return { success: true };
    
  } catch (error) {
    console.error("Failed to update theme:", error);
    return { error: "Failed to update theme" };
  }
}
