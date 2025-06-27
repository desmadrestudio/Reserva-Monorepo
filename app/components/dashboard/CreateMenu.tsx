import { useState, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { themeDefault } from "@shopify/polaris-tokens";
import {
  PlusIcon,
  CalendarTimeIcon,
  BookIcon,
  NoteAddIcon,
} from "@shopify/polaris-icons";
import { useIsMobile } from "~/utils/useIsMobile";

type CreateMenuProps = {
  selectedDate: Date;
  renderTrigger?: (args: {
    openMenu: () => void;
    triggerRef: React.RefObject<HTMLDivElement>;
  }) => React.ReactNode;
};

export default function CreateMenu({ selectedDate, renderTrigger }: CreateMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const dateParam = selectedDate.toISOString().split("T")[0];
  const items: Polaris.ActionListItemDescriptor[] = [
    {
      content: "Create Appointment",
      prefix: <Polaris.Icon source={CalendarTimeIcon} />,
      onAction: () => {
        setOpen(false);
        navigate(`/appointments/new?date=${dateParam}`);
      },
    },
    {
      content: "Create Class",
      prefix: <Polaris.Icon source={BookIcon} />,
      onAction: () => {
        setOpen(false);
        navigate(`/classes/new?date=${dateParam}`);
      },
    },
    {
      content: "Create Personal Event",
      prefix: <Polaris.Icon source={NoteAddIcon} />,
      onAction: () => {
        setOpen(false);
        navigate(`/events/new?date=${dateParam}`);
      },
    },
  ];

  const toggleMenu = () => setOpen((o) => !o);
  const openMenu = () => setOpen(true);

  const trigger = renderTrigger
    ? renderTrigger({ openMenu, triggerRef: buttonRef })
    : (
        <div
          ref={buttonRef}
          style={{
            position: isMobile ? "fixed" : "absolute",
            top: isMobile ? themeDefault.space["space-200"] : themeDefault.space["space-400"],
            right: isMobile ? themeDefault.space["space-200"] : themeDefault.space["space-400"],
            zIndex: 50,
            pointerEvents: "auto",
          }}
        >
          <Polaris.Button
            icon={PlusIcon}
            variant="primary"
            size="slim"
            onClick={toggleMenu}
            accessibilityLabel="Create menu"
          >
            {!isMobile && "Create"}
          </Polaris.Button>
        </div>
      );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Polaris.Sheet
          open={open}
          onClose={() => setOpen(false)}
          activator={buttonRef}
          accessibilityLabel="Create menu"
        >
          <Polaris.BlockStack gap="200" padding="400">
            <Polaris.ActionList items={items} actionRole="menuitem" />
            <Polaris.Button onClick={() => setOpen(false)} fullWidth>
              Cancel
            </Polaris.Button>
          </Polaris.BlockStack>
        </Polaris.Sheet>
      </>
    );
  }

  return (
    <Polaris.Popover
      active={open}
      activator={trigger}
      onClose={() => setOpen(false)}
      autofocusTarget="first-node"
      preferredAlignment="right"
    >
      <Polaris.ActionList items={items} actionRole="menuitem" />
    </Polaris.Popover>
  );
}
