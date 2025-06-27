import { useLocation } from "@remix-run/react";
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
    <Polaris.Box
      as="nav"
      position="fixed"
      bottom="0"
      width="100%"
      background="bg"
      borderBlockStartWidth="025"
      borderColor="border"
      padding="200"
      zIndex="2"
    >
      <Polaris.InlineStack align="space-around" blockAlign="center" gap="400">
        {mobileNavigation.map((tab) => {
          const isActive = location.pathname.startsWith(tab.url);
          return (
            <Polaris.Link key={tab.url} url={tab.url} aria-label={tab.label}>
              <Polaris.Box padding="200" borderRadius="200">
                <Polaris.InlineStack align="center" blockAlign="center" gap="100">
                  <Polaris.Icon
                    source={tab.icon}
                    color={isActive ? "interactive" : "subdued"}
                  />
                </Polaris.InlineStack>
                <Polaris.Text
                  as="span"
                  variant="bodySm"
                  color={isActive ? "interactive" : "subdued"}
                >
                  {tab.label}
                </Polaris.Text>
              </Polaris.Box>
            </Polaris.Link>
          );
        })}
        <Polaris.Link url={newAppointmentPath} aria-label="Book new appointment">
          <Polaris.Box padding="200" borderRadius="200">
            <Polaris.Icon source={PlusIcon} color="interactive" />
          </Polaris.Box>
        </Polaris.Link>
      </Polaris.InlineStack>
    </Polaris.Box>
  );
}
