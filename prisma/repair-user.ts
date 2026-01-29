import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_CATEGORIES = [
  { name: 'Housing', type: 'EXPENSE', icon: 'home', color: '#ef4444' },
  { name: 'Food', type: 'EXPENSE', icon: 'utensils', color: '#f97316' },
  { name: 'Transport', type: 'EXPENSE', icon: 'car', color: '#eab308' },
  { name: 'Entertainment', type: 'EXPENSE', icon: 'clapperboard', color: '#8b5cf6' },
  { name: 'Salary', type: 'INCOME', icon: 'wallet', color: '#22c55e' },
  { name: 'Freelance', type: 'INCOME', icon: 'laptop', color: '#0ea5e9' },
]

async function main() {
  console.log('🔧 Starting repair...')

  // Find users with no accounts
  const users = await prisma.user.findMany({
    include: {
      userAccounts: true
    }
  })

  for (const user of users) {
    if (user.userAccounts.length === 0) {
      console.log(`Fixing user: ${user.email} (${user.id})`)

      // 1. Create Wallet
      await prisma.userAccount.create({
        data: {
          name: "Wallet",
          type: "CASH",
          balance: 0,
          userId: user.id
        }
      })

      // 2. Create Categories (Check if they exist first to be safe, or just createMany if empty)
      const catCount = await prisma.category.count({ where: { userId: user.id }})
      if (catCount === 0) {
        await prisma.category.createMany({
          data: DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            // @ts-ignore
            type: cat.type, 
            userId: user.id
          }))
        })
      }
      
      console.log(`✅ Fixed!`)
    } else {
      console.log(`Skipping ${user.email} (already has accounts)`)
    }
  }
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
