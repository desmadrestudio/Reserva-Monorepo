// This file defines the left-hand sidebar menu items for desktop/dashboard views.
// It does NOT power the mobile nav (see MobileTabBar.tsx).

import type { IconProps } from "@shopify/polaris";
import {
  HomeIcon,
  CalendarIcon,
  ProductIcon,
  GiftCardIcon,
  CashDollarIcon,
  PersonIcon,
  NoteIcon,
  TeamIcon,
  SettingsIcon,
  PointOfSaleIcon,
  MenuHorizontalIcon,
} from "@shopify/polaris-icons";
import { getAppUrl } from "~/utils/url";

export interface NavigationItem {
  label: string;
  url: string;
  icon: IconProps["source"];
}

export const navigationItems: NavigationItem[] = [
  { label: "Home", url: getAppUrl("/"), icon: HomeIcon },
  { label: "Appointments", url: getAppUrl("/dashboard/calendar"), icon: CalendarIcon },
  { label: "Checkout", url: getAppUrl("/dashboard/checkout"), icon: PointOfSaleIcon },
  { label: "Services", url: getAppUrl("/dashboard/services"), icon: ProductIcon },
  { label: "Memberships & Rewards", url: getAppUrl("/dashboard/memberships"), icon: GiftCardIcon },
  { label: "Payments & Invoices", url: getAppUrl("/dashboard/payments"), icon: CashDollarIcon },
  { label: "Customers", url: getAppUrl("/dashboard/customers"), icon: PersonIcon },
  { label: "Reports", url: getAppUrl("/dashboard/reports"), icon: NoteIcon },
  { label: "Staff", url: getAppUrl("/dashboard/staff"), icon: TeamIcon },
  { label: "Settings", url: getAppUrl("/dashboard/settings"), icon: SettingsIcon },
];

// Keep the existing export name for components expecting `desktopNavigation`
export const desktopNavigation: NavigationItem[] = navigationItems;

export const mobileNavigation: NavigationItem[] = [
  { label: "Calendar", url: getAppUrl("/dashboard/calendar"), icon: CalendarIcon },
  { label: "Checkout", url: getAppUrl("/dashboard/checkout"), icon: PointOfSaleIcon },
  { label: "Customers", url: getAppUrl("/dashboard/customers"), icon: PersonIcon },
  { label: "More", url: getAppUrl("/dashboard/settings"), icon: MenuHorizontalIcon },
];

export const newAppointmentPath = getAppUrl("/appointments/new");
