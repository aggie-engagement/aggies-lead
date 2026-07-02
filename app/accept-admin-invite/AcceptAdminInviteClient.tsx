"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthState";
import {
  accessStorageKeys,
  ensureAccessSeedData,
  readJson,
  seedUsers,
  writeJson,
} from "@/lib/accessManagement";
import type { AdminInvite, User } from "@/lib/accessManagement";
import { queuePlaceholderEmail } from "@/lib/emailService";

export function AcceptAdminInviteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("inviteId") ?? "";
  const { loginWithCredentials } = useAuth();
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    ensureAccessSeedData();
    setInvites(readJson<AdminInvite[]>(accessStorageKeys.adminInvites, []));
    setUsers(readJson<User[]>(accessStorageKeys.users, seedUsers));
  }, []);

  const invite = useMemo(
    () => invites.find((item) => item.id === inviteId && item.status === "pending"),
    [inviteId, invites],
  );

  const acceptInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invite) {
      setMessage("This admin invite is not available or has already been used.");
      return;
    }
    if (!firstName || !lastName || password.length < 8) {
      setMessage("Enter your name and a password with at least 8 characters.");
      return;
    }
    const email = invite.email.toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === email && user.status === "active")) {
      setMessage("An active user already exists for this invite email.");
      return;
    }
    const timestamp = new Date().toISOString();
    const nextUser: User = {
      id: `admin-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      role: "admin",
      teamIds: [],
      title: "Program Administrator",
      status: "active",
      mustChangePassword: false,
      password,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const nextUsers = [nextUser, ...users];
    const nextInvites = invites.map((item) =>
      item.id === invite.id ? { ...item, status: "accepted" as const, acceptedAt: timestamp } : item,
    );
    writeJson(accessStorageKeys.users, nextUsers);
    writeJson(accessStorageKeys.adminInvites, nextInvites);
    queuePlaceholderEmail("accountActivation", email, {
      firstName: nextUser.firstName,
      activationLink: `${window.location.origin}/admin-dashboard`,
    });
    const result = loginWithCredentials(email, password);
    router.push(result.href ?? "/admin-dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Invite</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Accept Admin Access
        </h1>
        <p className="mt-4 leading-7 text-aggie-light/76">
          Create your local prototype admin account from the invite, then continue to the Admin Dashboard.
        </p>

        {invite ? (
          <form onSubmit={acceptInvite} className="mt-6 grid gap-4">
            <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-light">
              Invite email: {invite.email}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" value={firstName} onChange={setFirstName} />
              <Input label="Last name" value={lastName} onChange={setLastName} />
            </div>
            <Input label="Create password" value={password} onChange={setPassword} type="password" />
            <button
              type="submit"
              className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
            >
              Accept Invite and Continue
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
            This invite is not pending. Ask an existing admin to send a new invite.
          </p>
        )}

        {message ? (
          <p className="mt-4 rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}
