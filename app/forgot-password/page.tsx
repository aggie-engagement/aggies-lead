"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import {
  accessStorageKeys,
  ensureAccessSeedData,
  readJson,
  seedUsers,
  writeJson,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import { queuePlaceholderEmail } from "@/lib/emailService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const requestReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ensureAccessSeedData();
    const normalizedEmail = email.trim().toLowerCase();
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    const matchedUser = users.find((user) => user.email.toLowerCase() === normalizedEmail && user.status === "active");
    if (matchedUser) {
      const temporaryPassword = `Aggies${Math.floor(1000 + Math.random() * 9000)}!`;
      const nextUsers = users.map((user) =>
        user.id === matchedUser.id
          ? { ...user, password: temporaryPassword, mustChangePassword: true, updatedAt: new Date().toISOString() }
          : user,
      );
      writeJson(accessStorageKeys.users, nextUsers);
      queuePlaceholderEmail("passwordReset", matchedUser.email, {
        firstName: matchedUser.firstName,
        temporaryPassword,
        resetLink: `${window.location.origin}/change-password`,
      });
    }
    setMessage("If an account exists for this email, password reset instructions have been sent.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <KeyRound className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Password Help</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Forgot Password
        </h1>
        <p className="mt-4 leading-7 text-aggie-light/76">
          Enter your account email. Aggies Lead will use the configured email template for password reset instructions once live email delivery is connected.
        </p>
      </section>

      <form onSubmit={requestReset} className="card-surface rounded-lg p-6">
        <label className="block">
          <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
          />
        </label>
        <button type="submit" className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110">
          Request Password Reset
        </button>
        {message ? (
          <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}
        <Link href="/login" className="mt-4 inline-flex text-sm font-black text-aggie-ice">
          Return to Login
        </Link>
      </form>
    </div>
  );
}
