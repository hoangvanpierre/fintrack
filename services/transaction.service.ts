import prisma from "@/lib/prisma";
import { startOfMonth, subMonths, endOfMonth, format, parseISO } from "date-fns";

// Helper to determine date range
const getDateFilter = (from?: string, to?: string, defaultStart?: Date, defaultEnd?: Date) => {
  if (from && to) {
    return {
      gte: parseISO(from),
      lte: parseISO(to)
    };
  }
  return {
    gte: defaultStart,
    lte: defaultEnd
  };
};

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

export const getRecentTransactions = async (userId: string, from?: string, to?: string) => {
  const dateFilter = from && to ? {
    gte: parseISO(from),
    lte: parseISO(to)
  } : undefined;

  return await prisma.transaction.findMany({
    where: { 
      userId,
      date: dateFilter
    },
    orderBy: { date: 'desc' },
    take: 20, // Increased limit to 20 as requested
    include: {
      category: true
    }
  });
}

export const getStats = async (userId: string, from?: string, to?: string) => {
  const now = new Date();
  const defaultStart = startOfMonth(now);
  const defaultEnd = endOfMonth(now);

  const dateFilter = getDateFilter(from, to, defaultStart, defaultEnd);

  const stats = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      date: dateFilter
    },
    _sum: {
      amount: true
    }
  });

  const income = stats.find(s => s.type === 'INCOME')?._sum.amount?.toNumber() || 0;
  const expense = stats.find(s => s.type === 'EXPENSE')?._sum.amount?.toNumber() || 0;

  return { income, expense };
}

export const getCashflowData = async (userId: string, from?: string, to?: string) => {
  const today = new Date();
  const defaultStart = subMonths(today, 6);
  
  // If user picks a range, we show that range. If not, last 6 months.
  const dateFilter = getDateFilter(from, to, defaultStart, undefined);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: dateFilter
    },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      amount: true,
      type: true
    }
  });

  // Group by Date or Month depending on range size?
  // For simplicity, we stick to Month grouping for now, 
  // but if the range is short (e.g. 1 month), day grouping might be better.
  // Let's stick to Month grouping to keep charts consistent for now.
  const monthlyMap = new Map<string, number>();

  transactions.forEach(t => {
    const monthKey = format(t.date, 'MMM yyyy'); // Included year to distinguish Jan 2025 vs Jan 2026
    const val = t.type === 'INCOME' ? t.amount.toNumber() : -t.amount.toNumber();
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + val);
  });

  return Array.from(monthlyMap.entries()).map(([name, total]) => ({ name, total }));
}
  
export const getUserCategories = async (userId: string) => {
  return await prisma.category.findMany({
    where: { userId }
  });
}

export const getExpenseByCategory = async (userId: string, from?: string, to?: string) => {
  const now = new Date();
  const defaultStart = startOfMonth(now);
  const defaultEnd = endOfMonth(now);

  const dateFilter = getDateFilter(from, to, defaultStart, defaultEnd);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      date: dateFilter
    },
    include: {
      category: true
    }
  });

  const categoryMap = new Map<string, { name: string, value: number, color: string }>();

  transactions.forEach(t => {
    const catName = t.category.name;
    const current = categoryMap.get(catName) || { 
      name: catName, 
      value: 0, 
      color: t.category.color || '#cccccc' 
    };
    current.value += t.amount.toNumber();
    categoryMap.set(catName, current);
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.value - a.value);
};

export const getIncomeVsExpense = async (userId: string, from?: string, to?: string) => {
  const today = new Date();
  const defaultStart = subMonths(today, 6);
  
  const dateFilter = getDateFilter(from, to, defaultStart, undefined);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: dateFilter
    },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      amount: true,
      type: true
    }
  });

  const monthlyMap = new Map<string, { name: string, income: number, expense: number }>();

  transactions.forEach(t => {
    const monthKey = format(t.date, 'MMM yyyy');
    const entry = monthlyMap.get(monthKey) || { name: monthKey, income: 0, expense: 0 };
    
    if (t.type === 'INCOME') {
      entry.income += t.amount.toNumber();
    } else {
      entry.expense += t.amount.toNumber();
    }
    
    monthlyMap.set(monthKey, entry);
  });

  return Array.from(monthlyMap.values());
};