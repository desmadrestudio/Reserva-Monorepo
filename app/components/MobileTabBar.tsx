import { Link, useLocation } from "@remix-run/react";
import type { Location } from "@remix-run/react";

const tabs = [
  { label: "Calendar", path: "/dashboard/calendar" },
  { label: "Checkout", path: "/dashboard/checkout" },
  { label: "Customers", path: "/dashboard/customers" },
  { label: "Messages", path: "/dashboard/messages" },
  { label: "More", path: "/dashboard/settings" },
];

export default function MobileTabBar() {
  const location: Location = useLocation();

  return (
    <nav className="mobile-tab-bar">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={isActive ? "active" : ""}
          >
            <div>{tab.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}