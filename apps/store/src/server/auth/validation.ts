import { z } from "zod";

import { supportedLocales } from "@/lib/locale";

const passwordSchema = z
  .string()
  .min(12, "Password must contain at least 12 characters.")
  .max(128, "Password must be no more than 128 characters.");

export const registerCustomerSchema = z.object({
  locale: z.enum(supportedLocales),
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^\+?[0-9]{8,15}$/)),
  password: passwordSchema,
});

export const loginSchema = z.object({
  locale: z.enum(supportedLocales),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  password: z.string().min(1).max(128),
});

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
