import { AccountType, PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create a Demo User (Simulating a logged-in user for dev)
  // In production, users are created via Auth.js
  const demoUserEmail = 'demo@example.com'
  
  const user = await prisma.user.upsert({
    where: { email: demoUserEmail },
    update: {},
    create: {
      email: demoUserEmail,
      name: 'Demo User',
      image: 'https://github.com/shadcn.png',
    },
  })

  console.log(`👤 Created user: ${user.name} (${user.id})`)

  // 2. Create Default Accounts
  const accounts = [
    { name: 'Wallet', type: 'CASH', balance: 150.00 },
    { name: 'Chase Checking', type: 'BANK', balance: 2500.00 },
    { name: 'Savings', type: 'BANK', balance: 5000.00 },
  ]

  for (const acc of accounts) {
    await prisma.userAccount.create({
      data: {
        name: acc.name,
        type: acc.type as AccountType,
        balance: acc.balance,
        userId: user.id
      }
    })
  }

  // 3. Create Categories
  const categories = [
    { name: 'Housing', type: 'EXPENSE', icon: 'home', color: '#ef4444' }, // Red
    { name: 'Food', type: 'EXPENSE', icon: 'utensils', color: '#f97316' }, // Orange
    { name: 'Transport', type: 'EXPENSE', icon: 'car', color: '#eab308' }, // Yellow
    { name: 'Entertainment', type: 'EXPENSE', icon: 'clapperboard', color: '#8b5cf6' }, // Purple
    { name: 'Salary', type: 'INCOME', icon: 'wallet', color: '#22c55e' }, // Green
    { name: 'Freelance', type: 'INCOME', icon: 'laptop', color: '#0ea5e9' }, // Blue
  ]

  for (const cat of categories) {
    // Upsert to avoid duplicates if running seed multiple times
    await prisma.category.upsert({
      where: {
        name_userId_type: {
          name: cat.name,
          userId: user.id,
          type: cat.type as TransactionType
        }
      },
      update: {},
      create: {
        name: cat.name,
        type: cat.type as TransactionType,
        icon: cat.icon,
        color: cat.color,
        userId: user.id
      }
    })
  }

  console.log('✅ Seed complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
