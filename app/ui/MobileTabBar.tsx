import { Link, useLocation } from "@remix-run/react";
import { Icon } from "@shopify/polaris";
import {
  CalendarIcon,
  PointOfSaleIcon,
  PlusIcon,
  PersonIcon,
  MenuHorizontalIcon,
} from "@shopify/polaris-icons";
import type { Location } from "@remix-run/react";
import { getAppUrl } from "../utils/url";

const tabs = [
  { label: "Calendar", path: "/dashboard/calendar", icon: CalendarIcon },
  { label: "Checkout", path: "/dashboard/checkout", icon: PointOfSaleIcon },
  { label: "Book", path: getAppUrl("/appointments/new"), icon: PlusIcon },
  { label: "Customers", path: "/dashboard/customers", icon: PersonIcon },
  { label: "More", path: "/dashboard/settings", icon: MenuHorizontalIcon },
];

export default function MobileTabBar() {
  const location: Location = useLocation();

  return (
    <nav className="mobile-tab-bar">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <Link key={tab.path} to={tab.path} className={`tab-link ${isActive ? "active" : ""}`}>
            <Icon source={tab.icon} color={isActive ? "interactive" : "subdued"} />
            <div className="tab-label">{tab.label}</div>
          </Link>
        );
      })}
    </nav>
  );}