import { useLocation } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { mobileNavigation, newAppointmentPath } from "../config/navigation";
import { PlusIcon } from "@shopify/polaris-icons";
import MobileMenu from "./MobileMenu";
import type { Location } from "@remix-run/react";

export default function MobileTabBar() {
  const location: Location = useLocation();

  return (
    <Polaris.Box
      as="nav"
      className="mobile-tab-bar"
      position="fixed"
      insetInlineStart="0"
      insetInlineEnd="0"
      bottom="0"
      width="100%"
      background="bg"
      borderBlockStartWidth="025"
      borderColor="border"
      padding="200"
      zIndex="100"
    >
      <Polaris.InlineStack align="space-around" blockAlign="center" gap="400">
        <MobileMenu />
        {mobileNavigation.map((tab) => {
          const isActive = location.pathname.startsWith(tab.url);
          return (
            <Polaris.Link key={tab.url} url={tab.url} aria-label={tab.label}>
              <Polaris.BlockStack align="center" inlineAlign="center" gap="025">
                <Polaris.Icon
                  source={tab.icon}
                  color={isActive ? "interactive" : "subdued"}
                />
                <Polaris.Text
                  as="span"
                  variant="bodySm"
                  color={isActive ? "interactive" : "subdued"}
                >
                  {tab.label}
                </Polaris.Text>
              </Polaris.BlockStack>
            </Polaris.Link>
          );
        })}
        <Polaris.Link url={newAppointmentPath} aria-label="Book new appointment">
          <Polaris.BlockStack align="center" inlineAlign="center" gap="025">
            <Polaris.Icon source={PlusIcon} color="interactive" />
          </Polaris.BlockStack>
        </Polaris.Link>
      </Polaris.InlineStack>
    </Polaris.Box>
  );
}

