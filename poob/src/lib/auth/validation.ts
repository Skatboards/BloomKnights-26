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

const passwordSchema = z.string().min(1, "Enter your password.");
const displayNameSchema = z.string().trim().min(3, "Enter your display name. (Minimum 3 characters)").max(20, "Name must be 20 characters or fewer.");

/** Returns the first user-facing email validation error, if any. */
export function validateEmail(value: string) {
  const result = emailSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/** Returns the first user-facing sign-in password validation error, if any. */
export function validatePassword(value: string) {
  const result = passwordSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/** Returns the first user-facing display name validation error, if any. */
export function validateDisplayName(value: string) {
  const result = displayNameSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/** Validation used when an existing user submits credentials to sign in. */
export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Client-side registration validation. This intentionally checks only basic
 * field requirements; password strength is display-only in the browser.
 */
export const registrationFormSchema = credentialsSchema.extend({
  displayName: displayNameSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

/** Returns the first user-facing registration password validation error, if any. */
export function validateRegistrationPassword(value: string) {
  const result = registrationFormSchema.shape.password.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

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

/** Validation shared by the password reset form and its server endpoint. */
export const passwordResetFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (evaluatePasswordStrength(data.password).score < 3) {
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
