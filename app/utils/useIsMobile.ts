import * as Polaris from "@shopify/polaris";

export function useIsMobile() {
  return Polaris.useMediaQuery('(max-width: 768px)', { initializeWithValue: true });
}

