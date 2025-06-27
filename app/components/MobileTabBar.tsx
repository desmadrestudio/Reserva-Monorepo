import { Link, useLocation } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { mobileNavigation, newAppointmentPath } from "../config/navigation";
import { PlusIcon } from "@shopify/polaris-icons";
import { useIsMobile } from "../utils/useIsMobile";
import type { Location } from "@remix-run/react";

export default function MobileTabBar() {
  const location: Location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Polaris.BlockStack
      as="nav"
      align="space-between"
      inlineAlign="center"
      gap="0"
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "white",
        borderTop: "1px solid #ccc",
        padding: "0.5rem 0",
        zIndex: 20,
      }}
    >
      <Polaris.InlineStack gap="400" align="center" blockAlign="center" style={{ width: "100%", justifyContent: "space-around" }}>
        {mobileNavigation.map((tab) => {
          const isActive = location.pathname.startsWith(tab.url);
          return (
            <Link key={tab.url} to={tab.url} prefetch="intent">
              <Polaris.Button plain pressed={isActive} size="slim">
                <Polaris.BlockStack align="center" inlineAlign="center" gap="0">
                  <Polaris.Icon source={tab.icon} />
                  <span>{tab.label}</span>
                </Polaris.BlockStack>
              </Polaris.Button>
            </Link>
          );
        })}
        <Link to={newAppointmentPath} prefetch="intent">
          <Polaris.Button size="slim" variant="primary" accessibilityLabel="Book new appointment">
            <Polaris.Icon source={PlusIcon} />
          </Polaris.Button>
        </Link>
      </Polaris.InlineStack>
    </Polaris.BlockStack>
  );
}
