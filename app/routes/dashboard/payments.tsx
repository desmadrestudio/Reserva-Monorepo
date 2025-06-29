import { Outlet } from "@remix-run/react";
import { Page } from "@shopify/polaris";

export default function Layout() {
  return (
    <Page>
      <Outlet />
    </Page>
  );
}
