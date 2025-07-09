import { useState, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import {
  PlusIcon,
  CalendarTimeIcon,
  BookIcon,
  NoteAddIcon,
} from "@shopify/polaris-icons";
import { useIsMobile } from "../../utils/useIsMobile";
import { getAppUrl } from "../../utils/url";

export default function CreateMenu({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const dateParam = selectedDate.toISOString().split("T")[0];
  const items: Polaris.ActionListItemDescriptor[] = [
    {
      content: "Create Appointment",
      prefix: <Polaris.Icon source={CalendarTimeIcon} />,
      onAction: () => {
        setOpen(false);
        navigate(`${getAppUrl("/appointments/new")}?date=${dateParam}`);
      },
    },
    {
      content: "Create Class",
      prefix: <Polaris.Icon source={BookIcon} />,
      onAction: () => {
        setOpen(false);
        navigate(`${getAppUrl("/classes/new")}?date=${dateParam}`);
      },
    },
    {
      content: "Create Personal Event",
      prefix: <Polaris.Icon source={NoteAddIcon} />,
      onAction: () => {
        setOpen(false);
        navigate(`${getAppUrl("/events/new")}?date=${dateParam}`);
      },
    },
  ];

  return (
    <>
      <div
        ref={buttonRef}
        style={{
          position: isMobile ? "fixed" : "absolute",
          top: isMobile ? "0.5rem" : "1rem",
          right: isMobile ? "0.5rem" : "1rem",
          zIndex: 40,
        }}
      >
        <Polaris.Button
          icon={PlusIcon}
          variant="primary"
          size="slim"
          onClick={() => setOpen(true)}
          accessibilityLabel="Create menu"
        />
      </div>
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
