import { useLocation } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import {
  CalendarIcon,
  PointOfSaleIcon,
  PersonIcon,
  ChatIcon,
  MenuHorizontalIcon,
} from "@shopify/polaris-icons";
import type { Location } from "@remix-run/react";

const { Button, BlockStack, Icon, Text } = Polaris;

const tabs = [
  { label: "Calendar", path: "/dashboard/calendar", icon: CalendarIcon },
  { label: "Checkout", path: "/dashboard/checkout", icon: PointOfSaleIcon },
  { label: "Customers", path: "/dashboard/customers", icon: PersonIcon },
  { label: "Messages", path: "/dashboard/messages", icon: ChatIcon },
  { label: "More", path: "/dashboard/more", icon: MenuHorizontalIcon },
];

export default function MobileTabBar() {
  const location: Location = useLocation();

  return (
    <nav className="mobile-tab-bar">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <Button
            key={tab.path}
            url={tab.path}
            variant="plain"
            className={`tab-link ${isActive ? "active" : ""}`}
            accessibilityLabel={tab.label}
          >
            <BlockStack align="center" gap="025">
              <Icon source={tab.icon} color={isActive ? "interactive" : "subdued"} />
              <Text as="span" variant="bodySm" className="tab-label" tone={isActive ? "interactive" : "subdued"}>
                {tab.label}
              </Text>
            </BlockStack>
          </Button>
        );
      })}
    </nav>
  );
}