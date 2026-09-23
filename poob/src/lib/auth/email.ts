import "server-only";

import nodemailer from "nodemailer";

// env vars with defaults
const SMTP_HOST = process.env.EMAIL_SERVER_HOST ?? "smtp.resend.com";
const SMTP_PORT = Number(process.env.EMAIL_SERVER_PORT ?? 465);
const SMTP_USER = process.env.EMAIL_SERVER_USER ?? "resend";

// password must be user-specific
function getTransport() {
  const password = process.env.EMAIL_SERVER_PASSWORD;
  if (!password) {
    throw new Error("EMAIL_SERVER_PASSWORD must be configured to send email.");
  }
  if (!Number.isInteger(SMTP_PORT) || SMTP_PORT < 1 || SMTP_PORT > 65535) {
    throw new Error("EMAIL_SERVER_PORT must be a valid TCP port.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { 
      user: SMTP_USER, 
      pass: password 
    },
  });
}

function getAppUrl() {
  const configuredUrl = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (!configuredUrl) {
    throw new Error("AUTH_URL (or NEXTAUTH_URL) must be configured to send verification emails.");
  }

  let appUrl: URL;
  try {
    appUrl = new URL(configuredUrl);
  } catch {
    throw new Error("AUTH_URL must be an absolute application URL, such as https://poob.example.com.");
  }

  if (appUrl.protocol !== "http:" && appUrl.protocol !== "https:") {
    throw new Error("AUTH_URL must use http or https.");
  }

  return appUrl.origin;
}

export async function sendVerificationEmail(email: string, token: string) {
  const from = process.env.EMAIL_FROM;

  // email must be user-specific
  if (!from) {
    throw new Error("EMAIL_FROM must be configured to send email.");
  }

  const verificationUrl = new URL("/auth/verify", getAppUrl());
  verificationUrl.searchParams.set("token", token);

  await getTransport().sendMail({
    from: from,
    to: email,
    subject: "Verify your Poob account",
    text: `Verify your Poob account by opening this link: ${verificationUrl.toString()}`,
    html: `<p>Verify your Poob account by clicking the link below.</p><p><a href="${verificationUrl.toString()}">Verify email address</a></p><p>This link expires in 24 hours.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("EMAIL_FROM must be configured to send email.");
  }

  const resetUrl = new URL("/auth/password-reset", getAppUrl());
  resetUrl.searchParams.set("token", token);

  await getTransport().sendMail({
    from: from,
    to: email,
    subject: "Reset your Poob password",
    text: `Reset your Poob password by opening this link: ${resetUrl.toString()}`,
    html: `<p>Reset your Poob password by clicking the link below.</p><p><a href="${resetUrl.toString()}">Reset password</a></p><p>This link expires in 1 hour and can only be used once.</p>`,
  });
}
