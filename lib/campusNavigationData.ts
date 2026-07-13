import {
  campusNavigationLocations,
  type CampusNavigationLocation,
  type CampusNavigationPerson,
} from "@/lib/campusNavigationLocations";

export type CampusLocationContactRow = {
  id: string;
  location_id: string;
  name: string;
  title: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  sort_order: number;
};

export type CampusLocationRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  short_description: string | null;
  full_description: string | null;
  exterior_image_path: string | null;
  map_image_path: string | null;
  active: boolean;
  sort_order: number;
  campus_location_contacts?: CampusLocationContactRow[];
};

export type CampusLocationForm = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  exteriorImagePath: string;
  mapImagePath: string;
  sortOrder: string;
  active: boolean;
};

export type CampusLocationContactForm = {
  id?: string;
  locationId: string;
  name: string;
  title: string;
  photoUrl: string;
  email: string;
  phone: string;
  sortOrder: string;
  active: boolean;
};

export const emptyCampusLocationForm: CampusLocationForm = {
  name: "",
  slug: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  exteriorImagePath: "",
  mapImagePath: "",
  sortOrder: "0",
  active: true,
};

export const emptyCampusLocationContactForm: CampusLocationContactForm = {
  locationId: "",
  name: "",
  title: "",
  photoUrl: "",
  email: "",
  phone: "",
  sortOrder: "0",
  active: true,
};

export function slugifyCampusLocation(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getSupabaseClient() {
  const { supabase } = await import("@/lib/supabase");
  return supabase;
}

export async function readCampusNavigationLocations({ includeInactive = false } = {}) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("campus_locations")
    .select(`
      id,
      name,
      slug,
      category,
      description,
      short_description,
      full_description,
      exterior_image_path,
      map_image_path,
      active,
      sort_order,
      campus_location_contacts (
        id,
        location_id,
        name,
        title,
        photo_url,
        email,
        phone,
        active,
        sort_order
      )
    `)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as CampusLocationRow[];
  return rows
    .filter((location) => includeInactive || location.active)
    .map((location) => ({
      ...location,
      campus_location_contacts: (location.campus_location_contacts ?? [])
        .filter((contact) => includeInactive || contact.active)
        .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
    }));
}

export async function readStudentCampusNavigationLocations() {
  try {
    const rows = await readCampusNavigationLocations();
    if (!rows.length) {
      return { locations: campusNavigationLocations, source: "fallback" as const, error: "" };
    }

    return {
      locations: rows.map(toCampusNavigationLocation),
      source: "supabase" as const,
      error: "",
    };
  } catch (error) {
    return {
      locations: campusNavigationLocations,
      source: "fallback" as const,
      error: error instanceof Error ? error.message : "Unable to load Campus Navigation from Supabase.",
    };
  }
}

export async function saveCampusLocation(form: CampusLocationForm) {
  const supabase = await getSupabaseClient();
  const payload = {
    name: form.name.trim(),
    slug: slugifyCampusLocation(form.slug || form.name),
    category: nullableText(form.category),
    description: nullableText(form.shortDescription),
    short_description: nullableText(form.shortDescription),
    full_description: nullableText(form.fullDescription),
    exterior_image_path: nullableText(form.exteriorImagePath),
    map_image_path: nullableText(form.mapImagePath),
    sort_order: toInteger(form.sortOrder),
    active: form.active,
  };

  if (form.id) {
    return supabase.from("campus_locations").update(payload).eq("id", form.id);
  }

  return supabase.from("campus_locations").insert(payload);
}

export async function saveCampusLocationContact(form: CampusLocationContactForm) {
  const supabase = await getSupabaseClient();
  const payload = {
    location_id: form.locationId,
    name: form.name.trim(),
    title: nullableText(form.title),
    photo_url: nullableText(form.photoUrl),
    email: nullableText(form.email),
    phone: nullableText(form.phone),
    sort_order: toInteger(form.sortOrder),
    active: form.active,
  };

  if (form.id) {
    return supabase.from("campus_location_contacts").update(payload).eq("id", form.id);
  }

  return supabase.from("campus_location_contacts").insert(payload);
}

export async function setCampusLocationActive(id: string, active: boolean) {
  const supabase = await getSupabaseClient();
  return supabase.from("campus_locations").update({ active }).eq("id", id);
}

export function toCampusLocationForm(location: CampusLocationRow): CampusLocationForm {
  return {
    id: location.id,
    name: location.name,
    slug: location.slug,
    category: location.category ?? "",
    shortDescription: location.short_description ?? location.description ?? "",
    fullDescription: location.full_description ?? "",
    exteriorImagePath: location.exterior_image_path ?? "",
    mapImagePath: location.map_image_path ?? "",
    sortOrder: String(location.sort_order ?? 0),
    active: location.active,
  };
}

export function toCampusLocationContactForm(contact: CampusLocationContactRow): CampusLocationContactForm {
  return {
    id: contact.id,
    locationId: contact.location_id,
    name: contact.name,
    title: contact.title ?? "",
    photoUrl: contact.photo_url ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    sortOrder: String(contact.sort_order ?? 0),
    active: contact.active,
  };
}

function toCampusNavigationLocation(location: CampusLocationRow): CampusNavigationLocation {
  return {
    id: location.slug,
    folderName: location.slug,
    locationName: location.name,
    nickname: location.category ?? "",
    description: location.short_description ?? location.description ?? "",
    exteriorImage: location.exterior_image_path ?? "",
    mapImage: location.map_image_path ?? "",
    additionalImages: [],
    buildingDetails: location.full_description ?? location.description ?? "",
    peopleToKnow: (location.campus_location_contacts ?? []).map(toCampusNavigationPerson),
  };
}

function toCampusNavigationPerson(contact: CampusLocationContactRow): CampusNavigationPerson {
  const details = [contact.title, contact.email, contact.phone].filter(Boolean).join(" | ");

  return {
    name: contact.name,
    title: details,
    headshot: contact.photo_url ?? "",
  };
}

function nullableText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
