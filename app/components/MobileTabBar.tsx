import { Link, useLocation } from "@remix-run/react";
import type { Location } from "@remix-run/react";

const tabs = [
  { label: "Calendar", path: "/frontend/dashboard/calendar" },
  { label: "Checkout", path: "/frontend/dashboard/checkout" },
  { label: "Customers", path: "/frontend/dashboard/customers" },
  { label: "Messages", path: "/frontend/dashboard/messages" },
  { label: "More", path: "/frontend/dashboard/settings" },
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