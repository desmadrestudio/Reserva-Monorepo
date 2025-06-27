import { Link, useLocation } from "@remix-run/react";
import { Icon } from "@shopify/polaris";
import CreateMenu from "./dashboard/CreateMenu";
import {
  CalendarIcon,
  PointOfSaleIcon,
  PlusIcon,
  PersonIcon,
  MenuHorizontalIcon,
} from "@shopify/polaris-icons";
import type { Location } from "@remix-run/react";

const tabs = [
  { label: "Calendar", path: "/dashboard/calendar", icon: CalendarIcon },
  { label: "Checkout", path: "/dashboard/checkout", icon: PointOfSaleIcon },
  { label: "Customers", path: "/dashboard/customers", icon: PersonIcon },
  { label: "More", path: "/dashboard/settings", icon: MenuHorizontalIcon },
];

export default function MobileTabBar() {
  const location: Location = useLocation();
  const today = new Date();

  return (
    <nav className="mobile-tab-bar">
      {tabs.slice(0, 2).map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-link ${isActive ? "active" : ""}`}
          >
            <Icon source={tab.icon} color={isActive ? "interactive" : "subdued"} />
            <div className="tab-label">{tab.label}</div>
          </Link>
        );
      })}
      <CreateMenu
        selectedDate={today}
        renderTrigger={(openMenu, ref) => (
          <button ref={ref} type="button" className="tab-link" onClick={openMenu}>
            <Icon source={PlusIcon} color="subdued" />
            <div className="tab-label">Book</div>
          </button>
        )}
      />
      {tabs.slice(2).map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-link ${isActive ? "active" : ""}`}
          >
            <Icon source={tab.icon} color={isActive ? "interactive" : "subdued"} />
            <div className="tab-label">{tab.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}