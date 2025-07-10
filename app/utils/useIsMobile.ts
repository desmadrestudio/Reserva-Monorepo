import * as Polaris from "@shopify/polaris";

// ✅ Only return true on the client
export function useIsMobile() {
  const isMounted = typeof window !== "undefined";
  const matches = Polaris.useMediaQuery("(max-width: 768px)", {
    initializeWithValue: true,
  });
  return isMounted ? matches : false;
}

