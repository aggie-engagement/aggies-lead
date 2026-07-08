"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/components/AuthState";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, changePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (password.length < 8) {
      setMessage("Use at least 8 characters for the new password.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setSaving(true);
    if (user.role === "student-athlete") {
      const { supabase } = await import("@/lib/supabase");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password,
        options: {
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
            role: "student_athlete",
          },
        },
      });

      if (signUpError) {
        setSaving(false);
        setMessage(signUpError.message);
        return;
      }

      if (!signUpData.session) {
        setSaving(false);
        setMessage("Check your school email to verify your Aggies Lead account. After verification, log in with your school email and new password to finish your profile.");
        return;
      }

      const { error: claimError } = await supabase.rpc("claim_student_activation_invite");
      if (claimError) {
        setSaving(false);
        setMessage(claimError.message);
        return;
      }
    }
    const href = changePassword(password);
    setSaving(false);
    router.push(href);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <KeyRound className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">First Login</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
          Change Temporary Password
        </h1>
        <p className="mt-4 leading-7 text-aggie-light/76">
          Replace your temporary password before continuing. Student-athletes will complete their profile next so Aggies Lead can connect the account to the correct team and roadmap.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">New Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
            />
          </label>
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Confirm Password</span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving Password..." : "Save Password and Continue"}
          </button>
          {message ? (
            <p className="rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm font-bold text-aggie-light">
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
