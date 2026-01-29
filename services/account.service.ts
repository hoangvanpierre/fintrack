import prisma from "@/lib/prisma";

export const getUserAccounts = async (userId: string) => {
  const accounts = await prisma.userAccount.findMany({
    where: { userId },
    orderBy: { balance: 'desc' }
  });
  
  return accounts.map(account => ({
    ...account,
    balance: account.balance.toNumber()
  }));
};

export const getAccountBalance = async (accountId: string) => {
  const account = await prisma.userAccount.findUnique({
    where: { id: accountId },
    select: { balance: true }
  });
  return account?.balance?.toNumber() ?? 0;
};

export const getTotalBalance = async (userId: string) => {
  const accounts = await prisma.userAccount.findMany({
    where: { userId },
    select: { balance: true }
  });

  return accounts.reduce((acc, curr) => acc + curr.balance.toNumber(), 0);
};