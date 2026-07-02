"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Save, Undo2 } from "lucide-react";
import { usePrototypeState } from "@/components/PrototypeState";

type StorageSnapshot = Record<string, string>;

export function ModuleProgressShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<number | null>(null);
  const snapshotRef = useRef<StorageSnapshot | null>(null);
  const { resetModuleCompletion } = usePrototypeState();
  const [toast, setToast] = useState<{ visible: boolean; countdown: number }>({ visible: false, countdown: 10 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prepareButtons = () => {
      const buttons = Array.from(container.querySelectorAll("button"));
      buttons.forEach((button) => {
        const text = button.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
        if (text === "save progress") {
          button.dataset.autoSaveButton = "true";
          button.style.display = "none";
        }
        if (text === "reset module") {
          button.dataset.moduleResetButton = "true";
          button.style.display = "none";
        }
      });
    };

    const autoSave = window.setTimeout(prepareButtons, 0);
    const mutationObserver = new MutationObserver(prepareButtons);
    mutationObserver.observe(container, { childList: true, subtree: true });

    let saveTimer: number | null = null;
    const triggerAutoSave = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button[data-auto-save-button="true"], button[data-module-reset-button="true"]')) return;
      if (saveTimer) window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => {
        const saveButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('button[data-auto-save-button="true"]'));
        saveButtons.forEach((button) => button.click());
        window.localStorage.setItem(`aggies-lead:auto-save:${slug}`, new Date().toISOString());
      }, 250);
    };

    container.addEventListener("input", triggerAutoSave, true);
    container.addEventListener("change", triggerAutoSave, true);
    container.addEventListener("click", triggerAutoSave, true);

    return () => {
      window.clearTimeout(autoSave);
      if (saveTimer) window.clearTimeout(saveTimer);
      mutationObserver.disconnect();
      container.removeEventListener("input", triggerAutoSave, true);
      container.removeEventListener("change", triggerAutoSave, true);
      container.removeEventListener("click", triggerAutoSave, true);
    };
  }, [slug]);

  useEffect(() => {
    if (!toast.visible) return;
    countdownRef.current = window.setInterval(() => {
      setToast((current) => {
        if (current.countdown <= 1) {
          if (countdownRef.current) window.clearInterval(countdownRef.current);
          snapshotRef.current = null;
          return { visible: false, countdown: 0 };
        }
        return { ...current, countdown: current.countdown - 1 };
      });
    }, 1000);

    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, [toast.visible]);

  const resetModule = () => {
    const confirmed = window.confirm("Are you sure you want to reset this module?");
    if (!confirmed || !containerRef.current) return;

    snapshotRef.current = snapshotLocalStorage();
    resetModuleCompletion(slug);

    const resetButtons = Array.from(containerRef.current.querySelectorAll<HTMLButtonElement>('button[data-module-reset-button="true"]'));
    resetButtons.forEach((button) => button.click());

    removeLikelyModuleStorage(slug);
    setToast({ visible: true, countdown: 10 });
  };

  const undoReset = () => {
    if (!snapshotRef.current) return;
    Object.entries(snapshotRef.current).forEach(([key, value]) => {
      window.localStorage.setItem(key, value);
    });
    snapshotRef.current = null;
    setToast({ visible: false, countdown: 10 });
    window.location.reload();
  };

  return (
    <div ref={containerRef} className="space-y-5">
      <div className="card-surface rounded-lg p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">
            <Save className="h-4 w-4 text-aggie-ice" />
            Progress saves automatically
          </p>
          <button
            type="button"
            onClick={resetModule}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-300/25 bg-red-300/10 px-4 text-sm font-black text-aggie-light transition hover:bg-red-300/15"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Module
          </button>
        </div>
      </div>

      {children}

      {toast.visible ? (
        <div className="fixed bottom-4 left-4 z-[80] w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-aggie-ice/30 bg-aggie-navy p-4 text-aggie-light shadow-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black">Module reset.</p>
            <button
              type="button"
              onClick={undoReset}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/12"
            >
              <Undo2 className="h-4 w-4 text-aggie-ice" />
              Undo Reset ({toast.countdown})
            </button>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-aggie-ice transition-all" style={{ width: `${toast.countdown * 10}%` }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function snapshotLocalStorage() {
  const snapshot: StorageSnapshot = {};
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;
    const value = window.localStorage.getItem(key);
    if (value !== null) snapshot[key] = value;
  }
  return snapshot;
}

function removeLikelyModuleStorage(slug: string) {
  const variants = new Set([
    slug,
    slug.replaceAll("-and-", "-"),
    slug.replaceAll("and-", ""),
    slug.replaceAll("-and", ""),
    slug.replace("intro-to-networking", "intro-networking"),
    slug.replace("resume-review-and-update", "resume-review-update"),
    slug.replace("aggie-road-trips", "aggie-road-trip"),
  ]);

  const keysToRemove: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;
    if (Array.from(variants).some((variant) => key.includes(variant))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
}
