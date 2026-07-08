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

type SupabaseDebugError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

const pendingFirstAdminKey = "aggies-lead:pending-first-admin";
const authUserStorageKey = "aggies-lead:auth-user";

type PendingFirstAdmin = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

async function getSupabaseClient() {
  const { supabase } = await import("@/lib/supabase");
  return supabase;
}

function formatSupabaseRpcError(context: string, error: SupabaseDebugError) {
  return [
    `Unable to verify Supabase admin setup status. ${context}`,
    `message: ${error.message ?? "none"}`,
    `code: ${error.code ?? "none"}`,
    `details: ${error.details ?? "none"}`,
    `hint: ${error.hint ?? "none"}`,
  ].join("\n");
}

function readPendingFirstAdmin() {
  if (typeof window === "undefined") return null;
  const saved = window.sessionStorage.getItem(pendingFirstAdminKey);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as PendingFirstAdmin;
  } catch {
    window.sessionStorage.removeItem(pendingFirstAdminKey);
    return null;
  }
}

function writePendingFirstAdmin(pendingAdmin: PendingFirstAdmin) {
  window.sessionStorage.setItem(pendingFirstAdminKey, JSON.stringify(pendingAdmin));
}

function clearPendingFirstAdmin() {
  window.sessionStorage.removeItem(pendingFirstAdminKey);
}

function createLocalAdminSession(admin: User) {
  const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
  const nextUsers = [admin, ...users.filter((user) => user.id !== admin.id && user.email.toLowerCase() !== admin.email.toLowerCase())];
  writeJson(accessStorageKeys.users, nextUsers);
  window.localStorage.setItem(authUserStorageKey, JSON.stringify({ ...admin, name: `${admin.firstName} ${admin.lastName}`.trim() }));
}

export default function FirstAdminSetupPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [setupAllowed, setSetupAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSetupStatus() {
      ensureAccessSeedData();
      const users = readJson<User[]>(accessStorageKeys.users, seedUsers);
      const localSetupAllowed = shouldShowFirstAdminSetup(users);
      const supabase = await getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const { data: adminExists, error } = await supabase.rpc("first_admin_exists");

      if (!active) return;

      if (error) {
        setSetupAllowed(false);
        setMessage(formatSupabaseRpcError("first_admin_exists failed during page load.", error));
        setReady(true);
        return;
      }

      if (sessionData.session?.user && !adminExists) {
        const signedInUser = sessionData.session.user;
        const pendingAdmin = readPendingFirstAdmin();
        const firstName = String(signedInUser.user_metadata.first_name ?? pendingAdmin?.firstName ?? "").trim();
        const lastName = String(signedInUser.user_metadata.last_name ?? pendingAdmin?.lastName ?? "").trim();
        const email = signedInUser.email?.toLowerCase() ?? pendingAdmin?.email ?? "";

        if (!firstName || !lastName || !email) {
          setSetupAllowed(false);
          setMessage("You are signed in, but the first admin name or email is missing. Sign out of Supabase and restart first admin setup.");
          setReady(true);
          return;
        }

        setCreating(true);
        const { data: existingProfile, error: profileReadError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", signedInUser.id)
          .maybeSingle();

        if (!active) return;

        if (profileReadError) {
          setSetupAllowed(false);
          setCreating(false);
          setMessage(formatSupabaseRpcError("profile lookup failed after email verification.", profileReadError));
          setReady(true);
          return;
        }

        if (!existingProfile) {
          const { error: profileError } = await supabase.rpc("create_first_admin_profile", {
            first_name: firstName,
            last_name: lastName,
          });

          if (!active) return;

          if (profileError) {
            setSetupAllowed(false);
            setCreating(false);
            setMessage(profileError.message);
            setReady(true);
            return;
          }
        }

        const timestamp = new Date().toISOString();
        const firstAdmin: User = {
          id: signedInUser.id,
          firstName,
          lastName,
          email,
          role: "admin",
          teamIds: [],
          title: "Program Administrator",
          status: "active",
          mustChangePassword: false,
          password: pendingAdmin?.password ?? "",
          createdAt: timestamp,
          updatedAt: timestamp,
          isSeedAccount: false,
        };

        createLocalAdminSession(firstAdmin);
        clearPendingFirstAdmin();
        router.push("/admin-dashboard");
        return;
      }

      setSetupAllowed(localSetupAllowed && !adminExists);
      setReady(true);
    }

    checkSetupStatus();

    return () => {
      active = false;
    };
  }, [router]);

  const setField = (field: keyof FirstAdminForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createFirstAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
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

    setCreating(true);

    const supabase = await getSupabaseClient();
    const { data: adminExists, error: adminCheckError } = await supabase.rpc("first_admin_exists");
    if (adminCheckError) {
      setCreating(false);
      setMessage(formatSupabaseRpcError("first_admin_exists failed before creating the admin.", adminCheckError));
      return;
    }
    if (adminExists) {
      setCreating(false);
      setSetupAllowed(false);
      setMessage("An admin account already exists. Future admins must be added through Admin Settings.");
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: "admin",
        },
      },
    });

    if (signUpError) {
      setCreating(false);
      setMessage(signUpError.message);
      return;
    }

    if (!signUpData.user) {
      setCreating(false);
      setMessage("Supabase created no user for this signup. Try again or check your Supabase Auth settings.");
      return;
    }

    if (!signUpData.session) {
      writePendingFirstAdmin({
        userId: signUpData.user.id,
        firstName,
        lastName,
        email,
        password,
      });
      setCreating(false);
      setMessage("Check your email to verify this admin account. After verification, return to this page and sign in before completing first admin setup.");
      return;
    }

    const { error: profileError } = await supabase.rpc("create_first_admin_profile", {
      first_name: firstName,
      last_name: lastName,
    });

    if (profileError) {
      setCreating(false);
      setMessage(profileError.message);
      return;
    }

    const timestamp = new Date().toISOString();
    const firstAdmin: User = {
      id: signUpData.user.id,
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
    setCreating(false);
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
    const setupUnavailable = message.startsWith("Unable to verify");

    return (
      <section className="card-surface rounded-lg p-7">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Setup</p>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          {setupUnavailable ? "Admin Setup Unavailable" : "First Admin Already Created"}
        </h1>
        <p className="mt-4 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-aggie-light/78">
          {message || "Future admins must be added by an existing admin through Admin Settings."}
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
          <p className="mt-4 whitespace-pre-wrap rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={creating}
          className="chrome-surface mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {creating ? "Creating First Admin..." : "Create First Admin Account"}
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
