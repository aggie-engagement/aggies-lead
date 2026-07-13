"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ContactRound, Edit3, MapPinned, Plus, Power, Save, Search } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import {
  emptyCampusLocationContactForm,
  emptyCampusLocationForm,
  readCampusNavigationLocations,
  saveCampusLocation,
  saveCampusLocationContact,
  setCampusLocationActive,
  slugifyCampusLocation,
  toCampusLocationContactForm,
  toCampusLocationForm,
  type CampusLocationContactForm,
  type CampusLocationForm,
  type CampusLocationRow,
} from "@/lib/campusNavigationData";

export default function AdminCampusLocationsPage() {
  const [locations, setLocations] = useState<CampusLocationRow[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [locationForm, setLocationForm] = useState<CampusLocationForm>(emptyCampusLocationForm);
  const [contactForm, setContactForm] = useState<CampusLocationContactForm>(emptyCampusLocationContactForm);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? locations[0];
  const contacts = selectedLocation?.campus_location_contacts ?? [];

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return locations;
    return locations.filter((location) =>
      [
        location.name,
        location.slug,
        location.category ?? "",
        location.description ?? "",
        location.short_description ?? "",
        location.full_description ?? "",
      ].join(" ").toLowerCase().includes(query),
    );
  }, [locations, search]);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const rows = await readCampusNavigationLocations({ includeInactive: true });
      setLocations(rows);
      setSelectedLocationId((current) => {
        if (current && rows.some((location) => location.id === current)) return current;
        return rows[0]?.id ?? "";
      });
      setMessage(rows.length ? "" : "No Supabase campus locations found yet. Add the first one below.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load campus locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      setContactForm(emptyCampusLocationContactForm);
      return;
    }
    setContactForm({ ...emptyCampusLocationContactForm, locationId: selectedLocation.id });
  }, [selectedLocation?.id]);

  const handleLocationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!locationForm.name.trim()) {
      setMessage("Location name is required.");
      return;
    }

    setSaving(true);
    const nextForm = {
      ...locationForm,
      slug: slugifyCampusLocation(locationForm.slug || locationForm.name),
    };
    const { error } = await saveCampusLocation(nextForm);
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setLocationForm(emptyCampusLocationForm);
    setMessage(nextForm.id ? "Campus location updated." : "Campus location added.");
    await loadLocations();
  };

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const locationId = contactForm.locationId || selectedLocation?.id;
    if (!locationId) {
      setMessage("Select a campus location before adding a contact.");
      return;
    }
    if (!contactForm.name.trim()) {
      setMessage("Contact name is required.");
      return;
    }

    setSaving(true);
    const { error } = await saveCampusLocationContact({ ...contactForm, locationId });
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setContactForm({ ...emptyCampusLocationContactForm, locationId });
    setMessage(contactForm.id ? "Contact updated." : "Contact added.");
    await loadLocations();
  };

  const toggleLocationActive = async (location: CampusLocationRow) => {
    setSaving(true);
    const { error } = await setCampusLocationActive(location.id, !location.active);
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`${location.name} ${location.active ? "deactivated" : "activated"}.`);
    await loadLocations();
  };

  const startAddLocation = () => {
    setLocationForm(emptyCampusLocationForm);
    setMessage("");
  };

  const startEditLocation = (location: CampusLocationRow) => {
    setLocationForm(toCampusLocationForm(location));
    setSelectedLocationId(location.id);
    setMessage("");
  };

  return (
    <RoleGate allowed={["admin"]}>
      <div className="space-y-8">
        <section className="card-surface rounded-lg p-7">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">Admin Only</p>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Campus Locations
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-aggie-light/78">
            Manage the Campus Navigation locations, building photos, map images, and staff contacts shown to student-athletes.
          </p>
        </section>

        {message ? (
          <p className="rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">
            {message}
          </p>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <MapPinned className="h-6 w-6 text-aggie-ice" />
                <h2 className="text-2xl font-black text-white">All Locations</h2>
              </div>
              <button
                type="button"
                onClick={startAddLocation}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
              >
                <Plus className="h-4 w-4 text-aggie-ice" />
                Add Location
              </button>
            </div>

            <label className="relative mt-5 block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search locations"
                className="min-h-12 w-full rounded-lg border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none transition focus:border-aggie-ice"
              />
            </label>

            <div className="mt-5 grid gap-3">
              {loading ? (
                <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-muted">
                  Loading campus locations...
                </p>
              ) : filteredLocations.length ? filteredLocations.map((location) => (
                <article
                  key={location.id}
                  className={`rounded-lg border p-4 transition ${
                    selectedLocation?.id === location.id
                      ? "border-aggie-ice/40 bg-aggie-ice/10"
                      : "border-white/10 bg-white/6"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedLocationId(location.id)}
                    className="block w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-white">{location.name}</h3>
                        <p className="mt-1 text-sm font-bold text-aggie-muted">/{location.slug}</p>
                      </div>
                      <span className={`rounded-md border px-2 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                        location.active
                          ? "border-emerald-300/25 bg-emerald-300/10 text-aggie-light"
                          : "border-red-300/25 bg-red-300/10 text-aggie-light"
                      }`}>
                        {location.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-aggie-light/72">
                      {location.short_description ?? location.description ?? "No description added yet."}
                    </p>
                  </button>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => startEditLocation(location)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                    >
                      <Edit3 className="h-4 w-4 text-aggie-ice" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLocationActive(location)}
                      disabled={saving}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10 disabled:opacity-60"
                    >
                      <Power className="h-4 w-4 text-aggie-ice" />
                      {location.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </article>
              )) : (
                <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-muted">
                  No campus locations match that search.
                </p>
              )}
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">{locationForm.id ? "Edit Location" : "Add Location"}</h2>
            </div>
            <form onSubmit={handleLocationSubmit} className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput label="Name" value={locationForm.name} required onChange={(value) => setLocationForm({ ...locationForm, name: value, slug: locationForm.slug || slugifyCampusLocation(value) })} />
                <FormInput label="Slug" value={locationForm.slug} required onChange={(value) => setLocationForm({ ...locationForm, slug: slugifyCampusLocation(value) })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput label="Category" value={locationForm.category} onChange={(value) => setLocationForm({ ...locationForm, category: value })} />
                <FormInput label="Sort Order" value={locationForm.sortOrder} type="number" onChange={(value) => setLocationForm({ ...locationForm, sortOrder: value })} />
              </div>
              <FormTextarea label="Short Description" value={locationForm.shortDescription} onChange={(value) => setLocationForm({ ...locationForm, shortDescription: value })} />
              <FormTextarea label="Full Description" value={locationForm.fullDescription} rows={6} onChange={(value) => setLocationForm({ ...locationForm, fullDescription: value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput label="Exterior Image URL/Path" value={locationForm.exteriorImagePath} onChange={(value) => setLocationForm({ ...locationForm, exteriorImagePath: value })} />
                <FormInput label="Map Image URL/Path" value={locationForm.mapImagePath} onChange={(value) => setLocationForm({ ...locationForm, mapImagePath: value })} />
              </div>
              <ToggleInput label="Active" checked={locationForm.active} onChange={(active) => setLocationForm({ ...locationForm, active })} />
              <button
                type="submit"
                disabled={saving}
                className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : locationForm.id ? "Save Location" : "Add Location"}
              </button>
            </form>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ContactRound className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">Contacts</h2>
            </div>
            <p className="mt-2 text-sm font-semibold text-aggie-muted">
              {selectedLocation ? `Selected location: ${selectedLocation.name}` : "Select a location to manage contacts."}
            </p>
            <div className="mt-5 grid gap-3">
              {contacts.length ? contacts.map((contact) => (
                <article key={contact.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-white">{contact.name}</h3>
                      <p className="mt-1 text-sm font-bold text-aggie-light/74">{contact.title || "No title added"}</p>
                      <p className="mt-2 text-sm font-semibold text-aggie-muted">
                        {[contact.email, contact.phone].filter(Boolean).join(" | ") || "No contact details added"}
                      </p>
                    </div>
                    <span className={`rounded-md border px-2 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                      contact.active
                        ? "border-emerald-300/25 bg-emerald-300/10 text-aggie-light"
                        : "border-red-300/25 bg-red-300/10 text-aggie-light"
                    }`}>
                      {contact.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactForm(toCampusLocationContactForm(contact))}
                    className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                  >
                    <Edit3 className="h-4 w-4 text-aggie-ice" />
                    Edit Contact
                  </button>
                </article>
              )) : (
                <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold text-aggie-muted">
                  No contacts added for this location yet.
                </p>
              )}
            </div>
          </article>

          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">{contactForm.id ? "Edit Contact" : "Add Contact"}</h2>
            </div>
            <form onSubmit={handleContactSubmit} className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput label="Name" value={contactForm.name} required onChange={(value) => setContactForm({ ...contactForm, name: value })} />
                <FormInput label="Title" value={contactForm.title} onChange={(value) => setContactForm({ ...contactForm, title: value })} />
              </div>
              <FormInput label="Photo URL/Path" value={contactForm.photoUrl} onChange={(value) => setContactForm({ ...contactForm, photoUrl: value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput label="Email" value={contactForm.email} type="email" onChange={(value) => setContactForm({ ...contactForm, email: value })} />
                <FormInput label="Phone" value={contactForm.phone} onChange={(value) => setContactForm({ ...contactForm, phone: value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput label="Sort Order" value={contactForm.sortOrder} type="number" onChange={(value) => setContactForm({ ...contactForm, sortOrder: value })} />
                <ToggleInput label="Active" checked={contactForm.active} onChange={(active) => setContactForm({ ...contactForm, active })} />
              </div>
              <button
                type="submit"
                disabled={saving || !selectedLocation}
                className="chrome-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : contactForm.id ? "Save Contact" : "Add Contact"}
              </button>
            </form>
          </article>
        </section>
      </div>
    </RoleGate>
  );
}

function FormInput({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">
        {label}{required ? " *" : ""}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function FormTextarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function ToggleInput({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-aggie-light">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-aggie-ice"
      />
      {label}
    </label>
  );
}
