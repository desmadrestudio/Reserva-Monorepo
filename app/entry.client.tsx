import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { BASENAME } from "./utils/url";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser basename={BASENAME} />
    </StrictMode>
  );
});
