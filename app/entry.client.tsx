import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}

if ("requestIdleCallback" in window) {
  (window as any).requestIdleCallback(hydrate);
} else {
  setTimeout(hydrate, 1);
}