"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthState";
import {
  accessStorageKeys,
  ensureAccessSeedData,
  readJson,
  seedUsers,
  shouldShowFirstAdminSetup,
  writeJson,
} from "@/lib/accessManagement";
import type { User } from "@/lib/accessManagement";
import { queuePlaceholderEmail } from "@/lib/emailService";

type FirstAdminForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const emptyForm: FirstAdminForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function FirstAdminSetupPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [setupAllowed, setSetupAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureAccessSeedData();
    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    const allowed = shouldShowFirstAdminSetup(users);
    setSetupAllowed(allowed);
    setReady(true);
  }, []);

  const setField = (field: keyof FirstAdminForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createFirstAdmin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!firstName || !lastName || !email || !password || !form.confirmPassword) {
      setMessage("Complete every field before creating the first admin account.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== form.confirmPassword) {
      setMessage("Password and Confirm Password must match.");
      return;
    }

    const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
    if (!shouldShowFirstAdminSetup(users)) {
      setSetupAllowed(false);
      setMessage("An admin account already exists. Future admins must be added through Admin Settings.");
      return;
    }
    if (users.some((user) => user.email.toLowerCase() === email && user.status !== "removed")) {
      setMessage("An account already exists with that email.");
      return;
    }

    const timestamp = new Date().toISOString();
    const firstAdmin: User = {
      id: `admin-${Date.now()}`,
      firstName,
      lastName,
      email,
      role: "admin",
      teamIds: [],
      title: "Program Administrator",
      status: "active",
      mustChangePassword: false,
      password,
      createdAt: timestamp,
      updatedAt: timestamp,
      isSeedAccount: false,
    };

    writeJson(accessStorageKeys.users, [firstAdmin, ...users]);
    queuePlaceholderEmail("accountActivation", email, {
      firstName,
      activationLink: `${window.location.origin}/admin-dashboard`,
    });
    const result = loginWithCredentials(email, password);
    router.push(result.href ?? "/admin-dashboard");
  };

  if (!ready) {
    return (
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold text-aggie-light">Checking admin setup...</p>
      </section>
    );
  }

  if (!setupAllowed) {
    return (
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Setup</p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          First Admin Already Created
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-aggie-light/78">
          Future admins must be added by an existing admin through Admin Settings.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="chrome-surface mt-6 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Go to Login
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Setup</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
          Create First Admin Account
        </h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
          Create the first user-managed admin account for this local Aggies Lead prototype. After this account exists, future admins must be added through Admin Settings.
        </p>
      </section>

      <form onSubmit={createFirstAdmin} className="card-surface rounded-lg p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="First Name" value={form.firstName} onChange={(value) => setField("firstName", value)} />
          <TextInput label="Last Name" value={form.lastName} onChange={(value) => setField("lastName", value)} />
          <TextInput label="Email" value={form.email} type="email" onChange={(value) => setField("email", value)} />
          <TextInput label="Password" value={form.password} type="password" onChange={(value) => setField("password", value)} />
          <TextInput label="Confirm Password" value={form.confirmPassword} type="password" onChange={(value) => setField("confirmPassword", value)} />
        </div>
        {message ? (
          <p className="mt-4 rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Create First Admin Account
        </button>
      </form>
    </div>
  );
}

function TextInput({
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
