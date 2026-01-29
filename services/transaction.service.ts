import prisma from "@/lib/prisma";
import { startOfMonth, subMonths, endOfMonth, format } from "date-fns";

export const getTransactionsByUserId = async (userId: string) => {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    include: {
      category: true,
      account: true
    }
  });
};

export const getRecentTransactions = async (userId: string, limit = 5) => {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    include: {
      category: true
    }
  });
}

export const getMonthlyStats = async (userId: string) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const stats = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      date: {
        gte: start,
        lte: end
      }
    },
    _sum: {
      amount: true
    }
  });

  const income = stats.find(s => s.type === 'INCOME')?._sum.amount?.toNumber() || 0;
  const expense = stats.find(s => s.type === 'EXPENSE')?._sum.amount?.toNumber() || 0;

  return { income, expense };
}

export const getCashflowData = async (userId: string) => {
  // Get last 6 months
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: sixMonthsAgo
      }
    },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      amount: true,
      type: true
    }
  });

  // Group by Month (simplified for MVP)
  const monthlyMap = new Map<string, number>();

  transactions.forEach(t => {
    const monthKey = format(t.date, 'MMM');
    const val = t.type === 'INCOME' ? t.amount.toNumber() : -t.amount.toNumber();
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + val);
  });

  // Convert to array for Recharts
  // Note: In a real app, we'd ensure all months are present even if empty
    return Array.from(monthlyMap.entries()).map(([name, total]) => ({ name, total }));
  }
  
  export const getUserCategories = async (userId: string) => {
    return await prisma.category.findMany({
      where: { userId }
    });
  }
  