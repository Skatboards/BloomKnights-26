import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ 
    error: "Enter a valid email address." 
  }));

export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export function normalizeEmail(email: string) {
  return emailSchema.parse(email);
}
