import { useState, useRef } from "react";
import * as Polaris from "@shopify/polaris";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import { desktopNavigation } from "../config/sidebarMenu.config";
import { useIsMobile } from "../utils/useIsMobile";

export default function MobileMenu() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const activatorRef = useRef<HTMLDivElement>(null);

  if (!isMobile) return null;

  const items: Polaris.ActionListItemDescriptor[] = desktopNavigation.map(
    (item) => ({
      url: item.url,
      content: item.label,
      prefix: <Polaris.Icon source={item.icon} />,
      onAction: () => setOpen(false),
    })
  );

  return (
    <>
      <div ref={activatorRef}>
        <Polaris.Button
          variant="plain"
          onClick={() => setOpen(true)}
          accessibilityLabel="Open menu"
        >
          <Polaris.BlockStack align="center" inlineAlign="center" gap="025">
            <Polaris.Icon source={MenuHorizontalIcon} color="subdued" />
            <Polaris.Text as="span" variant="bodySm" color="subdued">
              Menu
            </Polaris.Text>
          </Polaris.BlockStack>
        </Polaris.Button>
      </div>
      <Polaris.Sheet
        open={open}
        onClose={() => setOpen(false)}
        activator={activatorRef}
        accessibilityLabel="Mobile menu"
      >
        <Polaris.BlockStack gap="200" padding="400">
          <Polaris.ActionList items={items} actionRole="menuitem" />
          <Polaris.Button onClick={() => setOpen(false)} fullWidth>
            Close
          </Polaris.Button>
        </Polaris.BlockStack>
      </Polaris.Sheet>
    </>
  );
}
