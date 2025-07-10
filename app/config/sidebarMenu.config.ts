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

export interface NavigationItem {
  label: string;
  url: string;
  icon: IconProps["source"];
}

export const navigationItems: NavigationItem[] = [
  { label: "Home", url: "/", icon: HomeIcon },
  { label: "Appointments", url: "/dashboard/calendar", icon: CalendarIcon },
  { label: "Checkout", url: "/dashboard/checkout", icon: PointOfSaleIcon },
  { label: "Services", url: "/dashboard/services", icon: ProductIcon },
  { label: "Memberships & Rewards", url: "/dashboard/memberships", icon: GiftCardIcon },
  { label: "Payments & Invoices", url: "/dashboard/payments", icon: CashDollarIcon },
  { label: "Customers", url: "/dashboard/customers", icon: PersonIcon },
  { label: "Reports", url: "/dashboard/reports", icon: NoteIcon },
  { label: "Staff", url: "/dashboard/staff", icon: TeamIcon },
  { label: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
];

// Keep the existing export name for components expecting `desktopNavigation`
export const desktopNavigation: NavigationItem[] = navigationItems;

export const mobileNavigation: NavigationItem[] = [
  { label: "Calendar", url: "/dashboard/calendar", icon: CalendarIcon },
  { label: "Checkout", url: "/dashboard/checkout", icon: PointOfSaleIcon },
  { label: "Customers", url: "/dashboard/customers", icon: PersonIcon },
  { label: "More", url: "/dashboard/settings", icon: MenuHorizontalIcon },
];

export const newAppointmentPath = "/appointments/new";
