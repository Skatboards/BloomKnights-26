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
