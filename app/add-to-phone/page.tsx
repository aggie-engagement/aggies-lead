"use client";

import { useEffect, useState } from "react";
import { Download, MonitorSmartphone, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function AddToPhonePage() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState("");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setMessage(choice.outcome === "accepted" ? "Aggies Lead install started." : "Install dismissed. You can still use the manual steps below.");
    setInstallPrompt(null);
  };

  return (
    <div className="space-y-8">
      <section className="card-surface rounded-lg p-7">
        <div className="flex items-center gap-3">
          <Smartphone className="h-7 w-7 text-aggie-ice" />
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Mobile App Setup</p>
        </div>
        <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
          Add Aggies Lead to Your Phone
        </h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
          Save Aggies Lead to your phone home screen so it opens like an app while still working as the regular website in your browser.
        </p>
      </section>

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Install Aggies Lead App</h2>
            </div>
            <p className="mt-3 max-w-3xl leading-7 text-aggie-light/74">
              If your browser supports app installation, use the button below. If not, follow the manual instructions for your phone.
            </p>
          </div>
          {installPrompt ? (
            <button
              type="button"
              onClick={installApp}
              className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
            >
              <Download className="h-4 w-4" />
              Install Aggies Lead App
            </button>
          ) : (
            <span className="rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-aggie-light">
              Manual install instructions available below
            </span>
          )}
        </div>
        {isStandalone ? (
          <p className="mt-5 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            Aggies Lead is already running in app mode.
          </p>
        ) : null}
        {message ? (
          <p className="mt-5 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <InstructionCard
          title="iPhone"
          steps={[
            "Open Aggies Lead in Safari",
            "Tap the Share button",
            "Tap Add to Home Screen",
            "Tap Add",
          ]}
        />
        <InstructionCard
          title="Android"
          steps={[
            "Open Aggies Lead in Chrome",
            "Tap the menu button",
            "Tap Add to Home Screen",
            "Tap Add",
          ]}
        />
      </section>
    </div>
  );
}

function InstructionCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <article className="card-surface rounded-lg p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/6 p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 text-sm font-black text-aggie-ice">
              {index + 1}
            </span>
            <p className="font-bold leading-7 text-aggie-light">{step}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
