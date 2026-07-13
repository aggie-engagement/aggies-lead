"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Check, MapPinned, RotateCcw, Save, Search, Timer, UserRound, X } from "lucide-react";
import { GhostButton } from "@/components/Prototype";
import { campusNavigationLocations } from "@/lib/campusNavigationLocations";
import { readStudentCampusNavigationLocations } from "@/lib/campusNavigationData";
import { moduleHref, roadmapModules } from "@/lib/roadmaps";

const storageKey = "aggies-lead:transfer:campus-navigation";

const commonNicknames: Record<string, string[]> = {
  "fueling-station": ["fueling", "fuel", "nutrition"],
  laub: ["laub", "athletics academics", "football building"],
  spectrum: ["the spec", "spec", "spectrum"],
  "wayne-estes": ["wayne estes", "estes", "wayne"],
  "olympic-complex": ["olympic", "olympic sports", "soccer complex"],
  "student-health": ["student health", "health", "wellness"],
  hper: ["hper", "arc", "the arc"],
  library: ["library", "merrill-cazier", "testing center"],
  "old-main": ["old main", "quad", "old main quad"],
  tsc: ["tsc", "taggart", "student center"],
  "indoor-laub": ["the indoor", "indoor", "indoor laub"],
  icon: ["icon", "performance", "sports performance"],
};

export function TransferCampusNavigationClient() {
  const [locations, setLocations] = useState(campusNavigationLocations);
  const [visited, setVisited] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState(campusNavigationLocations[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const selectedLocation = locations.find((location) => location.id === selectedId) ?? locations[0] ?? campusNavigationLocations[0];
  const filteredLocations = useMemo(() => {
    const normalized = normalizeSearch(searchTerm);
    if (!normalized) return locations;

    return locations.filter((location) => {
      const searchableValues = [
        location.id,
        location.locationName,
        location.nickname,
        location.description,
        location.buildingDetails,
        ...(commonNicknames[location.id] ?? []),
        ...location.peopleToKnow.flatMap((person) => [person.name, person.title]),
      ];

      return searchableValues.some((value) => normalizeSearch(value).includes(normalized));
    });
  }, [searchTerm]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { visited?: string[]; selectedId?: string };
      setVisited(parsed.visited ?? []);
      setSelectedId(parsed.selectedId ?? locations[0].id);
    } catch {
      setVisited([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    readStudentCampusNavigationLocations().then((result) => {
      if (!mounted) return;
      setLocations(result.locations);
      setSelectedId((current) => result.locations.some((location) => location.id === current) ? current : result.locations[0].id);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ visited, selectedId }));
  }, [visited, selectedId]);

  useEffect(() => {
    if (filteredLocations.length === 0) return;
    if (!filteredLocations.some((location) => location.id === selectedId)) {
      setSelectedId(filteredLocations[0].id);
    }
  }, [filteredLocations, selectedId]);

  const progress = useMemo(() => Math.round((visited.length / locations.length) * 100), [visited]);
  const status = progress === 100 ? "Completed" : progress === 0 ? "Not Started" : "In Progress";
  const nextHref = getNextTransferHref("Campus Navigation");

  function toggleVisited(id: string) {
    setVisited((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
    setSavedMessage("");
  }

  function saveProgress() {
    window.localStorage.setItem(storageKey, JSON.stringify({ visited, selectedId }));
    setSavedMessage("Progress saved on this device.");
  }

  function resetModule() {
    window.localStorage.removeItem(storageKey);
    setVisited([]);
    setSelectedId(locations[0].id);
    setSavedMessage("Module reset.");
  }

  return (
    <div className="space-y-6">
      <GhostButton href="/roadmaps/transfer">Back to Transfer Add-On</GhostButton>

      <section className="card-surface rounded-lg p-6 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Transfer Add-On</p>
            <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Campus Navigation + Who You Should Know
            </h1>
            <p className="mt-4 text-lg leading-8 text-aggie-light/78">
              Learn important locations around Utah State Athletics and connect each place with
              the staff members or people student-athletes should know.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-aggie-muted">
              <Timer className="h-4 w-4" />
              Estimated Time: 15-20 minutes
            </p>
          </div>
          <ProgressPanel completed={visited.length} percent={progress} status={status} total={locations.length} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Locations" icon={<MapPinned className="h-6 w-6" />}>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-muted" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="min-h-12 w-full rounded-lg border border-aggie-silver/15 bg-aggie-navy/78 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-aggie-muted focus:border-aggie-steel"
              placeholder='Search building, staff, or "the spec"...'
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-aggie-light transition hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">
            {filteredLocations.length} of {locations.length} locations
          </p>
          <div className="grid gap-2">
            {filteredLocations.map((location) => {
              const active = location.id === selectedId;
              const complete = visited.includes(location.id);
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setSelectedId(location.id)}
                  className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 text-left text-sm font-bold transition ${
                    active
                      ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                      : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
                  }`}
                >
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${complete ? "chrome-surface text-aggie-navy" : "border border-aggie-silver/20 text-transparent"}`}>
                    {complete && <Check className="h-4 w-4" />}
                  </span>
                  {location.locationName}
                </button>
              );
            })}
          </div>
          {filteredLocations.length === 0 && (
            <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold leading-6 text-aggie-light/78">
              No locations found. Try a building name, staff name, or nickname like the indoor.
            </div>
          )}
        </Card>

        <Card title="Quick Actions" icon={<Save className="h-6 w-6" />}>
          <p className="leading-7 text-aggie-light/74">
            Search by building, staff member, or common nickname, then mark each location reviewed.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
            <ActionButton onClick={saveProgress} icon={<Save className="h-4 w-4" />} primary>
              Save Progress
            </ActionButton>
            <ActionButton onClick={resetModule} icon={<RotateCcw className="h-4 w-4" />}>
              Reset Module
            </ActionButton>
          </div>
          {savedMessage && <p className="mt-4 text-sm font-bold text-aggie-ice">{savedMessage}</p>}
        </Card>
      </section>

      <section className="card-surface overflow-hidden rounded-lg">
        <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">Location</p>
            <h2 className="mt-2 text-3xl font-black text-white">{selectedLocation.locationName}</h2>
            <p className="mt-3 leading-7 text-aggie-light/78">{selectedLocation.description}</p>
            {selectedLocation.buildingDetails && (
              <div className="mt-6 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
                  What You&apos;ll Find Here
                </h3>
                <BuildingDetails value={selectedLocation.buildingDetails} />
              </div>
            )}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => toggleVisited(selectedLocation.id)}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition ${
                  visited.includes(selectedLocation.id)
                    ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110"
                    : "border-aggie-silver/25 text-white hover:border-aggie-steel hover:bg-white/10"
                }`}
              >
                <Check className="h-4 w-4" />
                {visited.includes(selectedLocation.id) ? "Reviewed" : "Mark Location Reviewed"}
              </button>
            </div>
          </div>
          <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-1">
            <ImagePanel label="Exterior / Building Photo" src={selectedLocation.exteriorImage} alt={`${selectedLocation.locationName} exterior`} />
            <ImagePanel label="Map / Location Image" src={selectedLocation.mapImage} alt={`${selectedLocation.locationName} map`} />
          </div>
        </div>
      </section>

      {selectedLocation.peopleToKnow.length > 0 && (
        <Card title="Who You Should Know" icon={<UserRound className="h-6 w-6" />}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {selectedLocation.peopleToKnow.map((person) => (
              <article
                key={person.name}
                className="group overflow-hidden rounded-lg border border-aggie-silver/15 bg-white/[0.055] shadow-steel transition hover:border-aggie-steel/60 hover:bg-white/[0.08]"
              >
                <div className="flex h-full flex-col sm:flex-row xl:flex-col">
                  <div className="bg-aggie-navy/70 p-3 sm:w-32 sm:shrink-0 xl:w-full">
                    <img
                      src={person.headshot}
                      alt={person.name}
                      className="aspect-square w-full rounded-lg object-cover object-top ring-1 ring-aggie-silver/15"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">
                      Staff Contact
                    </p>
                    <h3 className="mt-2 text-xl font-black text-white">{person.name}</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-aggie-light/76">
                      {person.title}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>
      )}

      <section className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">Module Progress</p>
            <h2 className="mt-2 text-2xl font-black text-white">{status}</h2>
            <p className="mt-2 leading-7 text-aggie-light/74">
              {visited.length} of {locations.length} locations reviewed.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/roadmaps/transfer" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">
              Back to Roadmap
            </Link>
            <Link href={nextHref} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-silver/25 px-5 text-sm font-bold text-white transition hover:border-aggie-steel hover:bg-white/10">
              Next Module
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgressPanel({ completed, percent, status, total }: { completed: number; percent: number; status: string; total: number }) {
  return (
    <div className="w-full rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-5 lg:max-w-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">{status}</span>
        <span className="text-2xl font-black text-white">{percent}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-aggie-navy/80">
        <div className="h-full rounded-full chrome-surface transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-sm font-medium text-aggie-light/72">
        {completed} of {total} locations reviewed
      </p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="card-surface rounded-lg p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
          {icon}
        </span>
        <h2 className="text-2xl font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ImagePanel({ label, src, alt }: { label: string; src: string; alt: string }) {
  return (
    <figure className="border-t border-aggie-silver/15 bg-aggie-navy/60 p-4 xl:border-l xl:border-t-0">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</p>
      {src ? (
        <img src={src} alt={alt} className="aspect-[4/3] w-full rounded-lg object-cover" />
      ) : (
        <div className="grid aspect-[4/3] w-full place-items-center rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-center text-sm font-bold text-aggie-muted">
          Image path not added yet.
        </div>
      )}
    </figure>
  );
}

function BuildingDetails({ value }: { value: string }) {
  const lines = value.split("\n");
  const sections: { heading?: string; bullets: string[]; paragraphs: string[] }[] = [];
  let current: { heading?: string; bullets: string[]; paragraphs: string[] } = {
    bullets: [],
    paragraphs: [],
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("-") || line.startsWith("â€¢") || line.startsWith("*")) {
      current.bullets.push(line.replace(/^[-â€¢*]\s*/, ""));
      continue;
    }

    if (line.toLowerCase().includes("floor")) {
      if (current.heading || current.bullets.length || current.paragraphs.length) {
        sections.push(current);
      }
      current = { heading: line, bullets: [], paragraphs: [] };
      continue;
    }

    current.paragraphs.push(line);
  }

  if (current.heading || current.bullets.length || current.paragraphs.length) {
    sections.push(current);
  }

  return (
    <div className="mt-4 space-y-4">
      {sections.map((section, index) => (
        <section key={`${section.heading ?? "details"}-${index}`}>
          {section.heading && <h4 className="text-base font-black text-white">{section.heading}</h4>}
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-2 text-sm font-bold leading-6 text-aggie-light/78">
              {paragraph}
            </p>
          ))}
          {section.bullets.length > 0 && (
            <ul className="mt-2 space-y-2 text-sm font-bold leading-6 text-aggie-light/78">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aggie-silver" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

function ActionButton({ children, onClick, icon, primary = false }: { children: ReactNode; onClick: () => void; icon: ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${primary ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-glow hover:brightness-110" : "border-aggie-silver/25 text-white hover:border-aggie-steel hover:bg-white/10"} inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition`}
    >
      {icon}
      {children}
    </button>
  );
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getNextTransferHref(currentTitle: string) {
  const index = roadmapModules.transfer.findIndex((title) => title === currentTitle);
  const nextTitle = roadmapModules.transfer[index + 1];
  return nextTitle ? moduleHref(nextTitle) : "/roadmaps/transfer";
}
