/**
 * Booking catalog (generic, app-agnostic)
 * ------------------------------------------------------------
 * This file ships with **generic placeholders** so the app works everywhere.
 * Store owners can edit these arrays (or manage them later in Settings UI)
 * without touching any server-only code. This file must stay **client-safe**
 * (no prisma imports here).
 */

// ---- Types -------------------------------------------------
export interface Location {
  id: string; // e.g. "loc_main"
  name: string; // e.g. "Main Spa"
}

export interface Category {
  id: string; // e.g. "cat_massage"
  name: string; // e.g. "Massage"
}

export interface Service {
  id: string; // e.g. "svc_swedish"
  categoryId: string; // FK -> Category.id
  name: string; // e.g. "Swedish Massage"
  description?: string;
  basePrice?: number; // optional base price in cents
  active?: boolean;
}

export interface DurationOption {
  id: string; // e.g. "dur_60"
  serviceId: string; // FK -> Service.id
  label: string; // e.g. "60 min"
  minutes: number; // e.g. 60
  priceDelta?: number; // optional delta in cents added to service base
}

export interface AddOn {
  id: string; // e.g. "addon_hot_stones"
  name: string; // e.g. "Hot Stones"
  description?: string;
  price: number; // price in cents
  active?: boolean;
}

export interface Provider {
  id: string; // e.g. "prov_ana"
  name: string; // e.g. "Ana G."
  gender?: "male" | "female" | "nonbinary" | "prefer_not_to_say";
  locationIds?: string[]; // locations where they work
  serviceIds?: string[]; // services they can perform
  active?: boolean;
}

// ---- Generic, safe defaults -------------------------------
// Keep these arrays minimal and brand‑neutral so any store can start.
// Store owners can change them freely. All prices are **cents**.

export const LOCATIONS: Location[] = [
  { id: "loc_main", name: "Main Location" },
];

export const CATEGORIES: Category[] = [
  { id: "cat_massage", name: "Massage" },
  { id: "cat_facial", name: "Facial" },
];

export const SERVICES: Service[] = [
  {
    id: "svc_relax",
    categoryId: "cat_massage",
    name: "Relaxation Massage",
    description: "Light to medium pressure full‑body massage.",
    basePrice: 9000, // $90.00
    active: true,
  },
  {
    id: "svc_custom_facial",
    categoryId: "cat_facial",
    name: "Custom Facial",
    description: "Cleansing, exfoliation, mask, and hydration.",
    basePrice: 11000, // $110.00
    active: true,
  },
];

export const DURATIONS: DurationOption[] = [
  { id: "dur_relax_60", serviceId: "svc_relax", label: "60 min", minutes: 60, priceDelta: 0 },
  { id: "dur_relax_90", serviceId: "svc_relax", label: "90 min", minutes: 90, priceDelta: 3000 },
  { id: "dur_facial_60", serviceId: "svc_custom_facial", label: "60 min", minutes: 60, priceDelta: 0 },
];

export const ADDONS: AddOn[] = [
  { id: "addon_hot_stones", name: "Hot Stones", price: 1500, active: true },
  { id: "addon_aromatherapy", name: "Aromatherapy", price: 1000, active: true },
  { id: "addon_glass_wine", name: "Glass of Wine", price: 1200, active: true },
];

export const PROVIDERS: Provider[] = [
  {
    id: "prov_alex",
    name: "Alex",
    gender: "prefer_not_to_say",
    locationIds: ["loc_main"],
    serviceIds: ["svc_relax", "svc_custom_facial"],
    active: true,
  },
];

// ---- Helpers ----------------------------------------------
// Small helpers your routes can use without DB access.

/** Get services for a category */
export function getServicesByCategory(categoryId: string): Service[] {
  return SERVICES.filter((s) => s.categoryId === categoryId && s.active !== false);
}

/** Get durations for a service */
export function getDurationsByService(serviceId: string): DurationOption[] {
  return DURATIONS.filter((d) => d.serviceId === serviceId);
}

/** Calculate price (base + duration delta + add‑ons) in cents */
export function priceForBooking({
  serviceId,
  durationId,
  addOnIds = [],
}: {
  serviceId: string;
  durationId?: string;
  addOnIds?: string[];
}): number | null {
  const svc = SERVICES.find((s) => s.id === serviceId);
  if (!svc) return null;
  let total = svc.basePrice ?? 0;
  if (durationId) {
    const dur = DURATIONS.find((d) => d.id === durationId && d.serviceId === serviceId);
    if (dur?.priceDelta) total += dur.priceDelta;
  }
  for (const id of addOnIds) {
    const ao = ADDONS.find((a) => a.id === id && a.active !== false);
    if (ao) total += ao.price;
  }
  return total;
}

// ---- Dev demo switch --------------------------------------
// You can hide all demo data by setting BOOKING_DEMO_DATA=0 in env.
export const DEMO_ENABLED = (process.env.BOOKING_DEMO_DATA ?? "1") !== "0";

export const CATALOG = {
  locations: DEMO_ENABLED ? LOCATIONS : [],
  categories: DEMO_ENABLED ? CATEGORIES : [],
  services: DEMO_ENABLED ? SERVICES : [],
  durations: DEMO_ENABLED ? DURATIONS : [],
  addOns: DEMO_ENABLED ? ADDONS : [],
  providers: DEMO_ENABLED ? PROVIDERS : [],
};

export type BookingCatalog = typeof CATALOG;
