import { z } from "zod";

export const AccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CASH", "BANK", "WALLET", "INVESTMENT", "OTHER"]),
  balance: z.coerce.number().default(0),
});

export type AccountFormValues = z.infer<typeof AccountSchema>;
