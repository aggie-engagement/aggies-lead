"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  ClipboardCheck,
  Download,
  History,
  MailWarning,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Smartphone,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePrototypeState } from "@/components/PrototypeState";

const imageBase = "/images/helper-helper";

const guideNav = [
  { href: "#overview", label: "What is it?", icon: ClipboardCheck },
  { href: "#download", label: "Download the app", icon: Download },
  { href: "#login", label: "Log in", icon: MailWarning },
  { href: "#opportunities", label: "Find opportunities", icon: Search },
  { href: "#past-commitments", label: "Past commitments", icon: History },
  { href: "#dos-donts", label: "Do's & Don'ts", icon: Check },
];

const overviewItems = [
  "Professional development hours",
  "Community service hours",
  "Event participation",
  "Student-athlete engagement opportunities",
];

const athleteActions = [
  "Sign up for opportunities directly through the app",
  "Add their own opportunities they attended",
  "Track approved and pending hours",
  "Monitor their overall involvement",
];

const opportunitySteps = [
  {
    label: "Step A",
    title: "Navigate to Opportunities",
    image: "finding-opportunities-pt1.jpg",
    text: "Open Opportunities to browse approved activities.",
  },
  {
    label: "Step B",
    title: "Viewing Available Opportunities",
    image: "finding-opportunities-pt2.jpg",
    text: "Review available events, workshops, service opportunities, and development activities.",
  },
  {
    label: "Step C",
    title: "Signing Up for an Opportunity",
    image: "selecting-opportunity-signing-up.jpg",
    text: "Select an opportunity, review details, and sign up in the app.",
  },
];

const pastCommitmentSteps = [
  {
    label: "Step A",
    title: "Open Navigation Menu",
    image: "3-bar-hh.jpg",
    text: "Select the menu icon to begin adding a past commitment or self-found opportunity.",
  },
  {
    label: "Step B",
    title: "Add Past Commitment",
    image: "adding-past-commitments.jpg",
    text: "Go to the past commitments area to start a new submission.",
  },
  {
    label: "Step C",
    title: "Select Event Type",
    image: "past-commitment-event.jpg",
    text: "Choose the event type that best matches what you attended.",
    note:
      "When adding a past commitment or self-found opportunity, the event type will usually be either Service or Development. Service is typically used for community engagement or volunteer opportunities. Development is typically used for career, leadership, or professional development activities.",
  },
  {
    label: "Step D",
    title: "Complete Past Commitment Form",
    image: "past-commitment-form.jpg",
    text: "Fill out the required details. Hours may remain pending until reviewed and approved.",
  },
];

const dos = [
  "Log hours soon after attending",
  "Use your correct USU email",
  "Check pending approvals",
  "Sign up for approved opportunities",
  "Ask Aggies Lead staff if you need help",
];

const donts = [
  "Use @aggies.usu.edu to log in",
  "Wait until the end of the semester to submit hours",
  "Submit inaccurate information",
  "Assume hours count before approval",
  "Submit duplicate opportunities",
];

export default function HelperHelperPage() {
  const { completeHelperHelper, completeModule } = usePrototypeState();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topAccessAnswer, setTopAccessAnswer] = useState<"yes" | "no" | null>(null);
  const [endAccessAnswer, setEndAccessAnswer] = useState<"yes" | "no" | null>(null);
  const [completed, setCompleted] = useState(false);

  function completeHelperHelperModule() {
    completeHelperHelper();
    completeModule("helper-helper");
    completeModule("helper-helper-setup");
    setCompleted(true);
  }

  return (
    <div className="space-y-12">
      <button
        type="button"
        onClick={() => setMobileMenuOpen((value) => !value)}
        className="card-surface inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-black text-white lg:hidden"
      >
        <Menu className="h-4 w-4" />
        {mobileMenuOpen ? "Hide guide" : "Show guide"}
      </button>

      <section
        className={`grid gap-8 transition-all duration-300 ${
          collapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[280px_1fr]"
        }`}
      >
        <aside
          className={`card-surface h-fit rounded-lg p-4 lg:sticky lg:top-28 ${
            mobileMenuOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-aggie-silver/15 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="chrome-surface grid h-11 w-11 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-steel">
                <Smartphone className="h-6 w-6" />
              </span>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-aggie-silver">
                    Guide
                  </p>
                  <p className="mt-1 truncate text-sm text-aggie-muted">Helper Helper</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 text-aggie-light transition hover:border-aggie-steel hover:bg-white/10 lg:grid"
              aria-label={collapsed ? "Expand guide menu" : "Collapse guide menu"}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          <nav className="mt-4 space-y-2">
            {guideNav.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex min-h-11 items-center rounded-lg border border-transparent text-sm font-bold text-aggie-light/78 transition hover:border-aggie-silver/20 hover:bg-white/10 hover:text-white ${
                    collapsed ? "justify-center px-2" : "gap-3 px-3"
                  }`}
                  title={item.label}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 text-xs font-black text-aggie-ice">
                    {collapsed ? <Icon className="h-4 w-4" /> : index + 1}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </a>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
            Utah State Athletics
          </p>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Helper Helper Setup & Navigation
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-aggie-light/76 md:text-xl md:leading-9">
            A quick guided walkthrough for logging in, finding opportunities, and
            tracking your hours.
          </p>
        </div>
      </section>

      <AccessQuestion
        answer={topAccessAnswer}
        onAnswer={setTopAccessAnswer}
        completed={completed}
        onComplete={completeHelperHelperModule}
      />

      {topAccessAnswer === "no" ? (
        <>
      <NumberedSection id="overview" number="01" title="What Is Helper Helper?">
        <div className="grid gap-5 lg:grid-cols-2">
          <SimpleCard title="What Is It?" icon={ClipboardCheck}>
            <List items={overviewItems} icon={ClipboardCheck} />
          </SimpleCard>
          <SimpleCard title="Purpose" icon={ClipboardCheck}>
            <p className="leading-7 text-aggie-light/74">
              Helper Helper is used to track student-athlete development hours,
              service hours, and other participation opportunities throughout the
              year. These records may be reviewed annually to help track engagement
              and participation in Aggies Lead programming.
            </p>
          </SimpleCard>
          <SimpleCard title="Athletes can" icon={Check}>
            <List items={athleteActions} icon={Check} />
          </SimpleCard>
        </div>
      </NumberedSection>

      <NumberedSection id="download" number="02" title="Download The App">
        <div className="card-surface grid gap-5 rounded-lg p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <span className="chrome-surface grid h-14 w-14 place-items-center rounded-lg text-aggie-navy shadow-glow">
            <Download className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-2xl font-black text-white">Helper Helper Mobile App</h3>
            <p className="mt-2 leading-7 text-aggie-light/72">
              Download the app before completing setup.
            </p>
          </div>
          <button
            type="button"
            className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            App Store
            <Download className="h-4 w-4" />
          </button>
        </div>
      </NumberedSection>

      <NumberedSection id="login" number="03" title="Step 1: Logging In">
        <div className="grid gap-6">
          <InstructionCard label="Step A" title="Request Temporary Password" icon={MailWarning}>
            <p>
              Text <strong className="text-white">775-548-6815</strong> with your full name,
              sport, and <strong className="text-white">"Need HH temp password"</strong>.
            </p>
            <p className="mt-3">A temporary password will be sent to your USU school email.</p>
            <p className="mt-3">
              If you already have a Helper Helper profile but are unable to log in,
              forgot your password, or need help accessing your account, text{" "}
              <strong className="text-white">[insert phone number]</strong>.
            </p>
          </InstructionCard>

          <WalkthroughCard
            label="Step B"
            title="Logging In"
            image="how-to-log-in.jpg"
            text="Use your USU school email to log in."
          >
            <EmailWarningCard />
          </WalkthroughCard>

          <WalkthroughCard
            label="Step C"
            title="Temporary Password Setup"
            image="login-password-page.jpg"
            text="Paste the temporary password from your school email, then create your permanent password."
          />
        </div>
      </NumberedSection>

      <NumberedSection id="opportunities" number="04" title="Step 2: Finding Opportunities">
        <p className="mb-6 max-w-3xl leading-7 text-aggie-light/76">
          Browse approved opportunities and sign up directly in the app.
        </p>
        <div className="grid gap-6">
          {opportunitySteps.map((step) => (
            <WalkthroughCard key={step.title} {...step} />
          ))}
        </div>
      </NumberedSection>

      <NumberedSection id="past-commitments" number="05" title="Step 3: Past Commitments Or Self-Found Opportunities">
        <p className="mb-6 max-w-3xl leading-7 text-aggie-light/76">
          If an approved opportunity was not listed in the app, submit it as a
          past commitment.
        </p>
        <div className="grid gap-6">
          {pastCommitmentSteps.map((step) => (
            <WalkthroughCard key={step.title} {...step}>
              {step.note && <EventTypeNote text={step.note} />}
            </WalkthroughCard>
          ))}
        </div>
      </NumberedSection>

      <NumberedSection id="dos-donts" number="06" title="Do's & Don'ts">
        <div className="grid gap-5 lg:grid-cols-2">
          <ChecklistCard title="Do" items={dos} tone="good" />
          <ChecklistCard title="Don't" items={donts} tone="bad" />
        </div>
      </NumberedSection>

      <AccessQuestion
        answer={endAccessAnswer}
        onAnswer={setEndAccessAnswer}
        completed={completed}
        onComplete={completeHelperHelperModule}
        showHelpMessage
      />
        </>
      ) : null}
    </div>
  );
}

function AccessQuestion({
  answer,
  onAnswer,
  completed,
  onComplete,
  showHelpMessage = false,
}: {
  answer: "yes" | "no" | null;
  onAnswer: (answer: "yes" | "no") => void;
  completed: boolean;
  onComplete: () => void;
  showHelpMessage?: boolean;
}) {
  return (
    <section className="card-surface rounded-lg p-6 md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">
            Helper Helper Access
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white md:text-3xl">
            Do you have a Helper Helper profile you can log into, and do you have the app downloaded?
          </h2>
        </div>
        <div className="flex shrink-0 gap-3">
          {(["yes", "no"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAnswer(option)}
              className={`min-h-12 rounded-lg border px-6 text-sm font-black transition ${
                answer === option
                  ? "border-aggie-chrome/50 bg-white/[0.12] text-white shadow-steel"
                  : "border-aggie-silver/20 bg-white/[0.045] text-aggie-light/80 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              {option === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {answer === "yes" ? (
        <div className="mt-6 rounded-lg border border-aggie-ice/25 bg-aggie-steel/12 p-5">
          <p className="font-bold leading-7 text-aggie-light">
            Great! You are ready to use Helper Helper.
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="chrome-surface mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
          >
            {completed ? "Module Complete" : "Complete Module"}
          </button>
        </div>
      ) : null}

      {showHelpMessage && answer === "no" ? (
        <div className="mt-6 rounded-lg border border-aggie-silver/20 bg-white/[0.045] p-5">
          <p className="font-bold leading-7 text-aggie-light">
            Please contact Aggies Lead for help getting access to Helper Helper.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function NumberedSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-aggie-silver">
          Section {number}
        </p>
        <h2 className="text-glow mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function SimpleCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <article className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-2xl font-black text-white">{title}</h3>
      </div>
      {children}
    </article>
  );
}

function InstructionCard({
  label,
  title,
  icon: Icon,
  children,
}: {
  label: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <article className="card-surface rounded-lg p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
          <div className="mt-3 leading-7 text-aggie-light/76">{children}</div>
        </div>
      </div>
    </article>
  );
}

function WalkthroughCard({
  label,
  title,
  image,
  text,
  children,
}: {
  label: string;
  title: string;
  image: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="card-surface overflow-hidden rounded-lg">
      <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-aggie-silver/15 bg-aggie-navy/70 p-4 lg:border-b-0 lg:border-r lg:border-aggie-silver/15">
          <ScreenshotFrame image={image} title={title} />
        </div>
        <div className="p-6 lg:p-7">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
          <p className="mt-4 max-w-2xl leading-7 text-aggie-light/76">{text}</p>
          {children}
        </div>
      </div>
    </article>
  );
}

function ScreenshotFrame({ image, title }: { image: string; title: string }) {
  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="relative aspect-[9/15.35] overflow-hidden rounded-xl border border-aggie-silver/20 bg-black/35 shadow-[0_22px_48px_rgba(0,0,0,0.32)]">
        <div className="absolute left-0 top-[-2.75%] h-[105.5%] w-full">
          <Image
            src={`${imageBase}/${image}`}
            alt={`${title} screenshot`}
            fill
            sizes="(min-width: 1024px) 300px, 82vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

function EmailWarningCard() {
  return (
    <div className="mt-6 rounded-lg border border-aggie-silver/20 bg-white/[0.045] p-5">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
        Important
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-aggie-steel/35 bg-aggie-steel/12 p-4">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">
            Use:
          </p>
          <p className="mt-3 break-all text-lg font-black leading-7 text-white sm:text-xl">
            A########@usu.edu
          </p>
        </div>
        <div className="rounded-lg border border-red-200/25 bg-red-500/10 p-4">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-red-100">
            Do Not Use:
          </p>
          <p className="mt-3 break-all text-lg font-black leading-7 text-white sm:text-xl">
            @aggies.usu.edu
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-aggie-muted">
        Using the wrong email may prevent login access.
      </p>
    </div>
  );
}

function EventTypeNote({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-lg border border-aggie-silver/20 bg-white/[0.045] p-5">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
        Event type note
      </p>
      <p className="mt-3 leading-7 text-aggie-light/76">{text}</p>
    </div>
  );
}

function List({ items, icon: Icon }: { items: string[]; icon: LucideIcon }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <IconLine key={item} icon={Icon} text={item} />
      ))}
    </div>
  );
}

function IconLine({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-aggie-silver/12 bg-white/[0.04] p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-aggie-steel/16 text-aggie-ice">
        <Icon className="h-4 w-4" />
      </span>
      <p className="font-semibold leading-6 text-aggie-light/78">{text}</p>
    </div>
  );
}

function ChecklistCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) {
  const Icon = tone === "good" ? Check : X;
  return (
    <article className="card-surface rounded-lg p-6">
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-lg border border-aggie-silver/12 bg-white/[0.04] p-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                tone === "good"
                  ? "bg-aggie-steel/20 text-aggie-ice"
                  : "bg-red-500/10 text-red-100"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="font-semibold leading-6 text-aggie-light/78">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
