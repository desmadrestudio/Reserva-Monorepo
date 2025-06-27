import * as Polaris from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import type { RefObject } from "react";

type Props = {
  openMenu: () => void;
  triggerRef: RefObject<HTMLDivElement>;
};

export default function CalendarCreateButton({ openMenu, triggerRef }: Props) {
  return (
    <div ref={triggerRef} style={{ position: "relative" }}>
      <Polaris.Button
        icon={PlusIcon}
        variant="primary"
        size="slim"
        onClick={openMenu}
        accessibilityLabel="Create menu"
      />
    </div>
  );
}

