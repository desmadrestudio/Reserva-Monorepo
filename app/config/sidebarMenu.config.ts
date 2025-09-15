// app/config/sidebarMenu.config.ts
// Defines sidebar navigation items for the desktop dashboard.
// Note: This does NOT power the mobile nav (see app/ui/MobileTabBar.tsx).

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
  { label: "Calendar", url: "/calendar", icon: CalendarIcon },
  { label: "Checkout", url: "/checkout", icon: PointOfSaleIcon },
  { label: "Services", url: "/services", icon: ProductIcon },
  { label: "Memberships & Rewards", url: "/memberships", icon: GiftCardIcon },
  { label: "Payments & Invoices", url: "/payments", icon: CashDollarIcon },
  { label: "Customers", url: "/customers", icon: PersonIcon },
  { label: "Reports", url: "/reports", icon: NoteIcon },
  { label: "Staff", url: "/staff", icon: TeamIcon },
  { label: "Settings", url: "/settings", icon: SettingsIcon },
];

export const desktopNavigation: NavigationItem[] = navigationItems;

export const mobileNavigation: NavigationItem[] = [
  { label: "Calendar", url: "/calendar", icon: CalendarIcon },
  { label: "Checkout", url: "/checkout", icon: PointOfSaleIcon },
  { label: "Customers", url: "/customers", icon: PersonIcon },
  { label: "More", url: "/settings", icon: MenuHorizontalIcon },
];

export const newAppointmentPath = "/appointments/new";
