import { z } from "zod";

export const TransactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
  categoryId: z.string().min(1, "Category is required"),
  accountId: z.string().min(1, "Account is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export type TransactionFormValues = z.infer<typeof TransactionSchema>;
