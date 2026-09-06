import { z } from "zod";
import zxcvbn from "zxcvbn";

export function evaluatePasswordStrength(password: string, userInputs: string[] = []) {
  const result = zxcvbn(password, userInputs);

  return {
    score: result.score,
    crackTimeDisplay: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    warning: result.feedback.warning,
    suggestions: result.feedback.suggestions,
  };
}

export function getPasswordStrengthLabel(score: number) {
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3) return "strong";
  return "very strong";
}

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ 
    error: "Enter a valid email address." 
  }));

/** Validation used when an existing user submits credentials to sign in. */
export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

/**
 * Client-side registration validation. This intentionally checks only basic
 * field requirements; password strength is display-only in the browser.
 */
export const registrationFormSchema = credentialsSchema.extend({
  displayName: z.string().trim().min(1, "Enter your name.").max(80, "Name must be 80 characters or fewer."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

/**
 * Server-side registration validation. The API must use this schema because
 * client-side checks can be bypassed. It adds the strong-password policy.
 */
export const registrationSchema = registrationFormSchema.superRefine((data, context) => {
  if (evaluatePasswordStrength(data.password, [data.displayName, data.email]).score < 3) {
    context.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password strength must be strong or very strong.",
    });
  }
});

export function normalizeEmail(email: string) {
  return emailSchema.parse(email);
}
