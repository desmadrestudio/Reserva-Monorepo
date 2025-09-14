import { Button } from "@shopify/polaris";

export default function GlobalHome() {
  return (
    <div style={{ position: "fixed", top: 12, left: 12, zIndex: 1000 }}>
      <Button url="/" size="slim">
        Home
      </Button>
    </div>
  );
}
