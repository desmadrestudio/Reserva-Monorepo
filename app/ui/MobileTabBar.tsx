import { Link, useLocation } from "@remix-run/react";
import { Icon } from "@shopify/polaris";
import { CalendarIcon, PointOfSaleIcon, PlusIcon, PersonIcon, MenuHorizontalIcon } from "@shopify/polaris-icons";
import type { Location } from "@remix-run/react";

const tabs = [
  { label: "Calendar", path: "/calendar", icon: CalendarIcon },
  { label: "Checkout", path: "/checkout", icon: PointOfSaleIcon },
  { label: "Book", path: "/booking", icon: PlusIcon },
  { label: "Customers", path: "/customers", icon: PersonIcon },
  { label: "More", path: "/settings", icon: MenuHorizontalIcon },
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
  );
}
