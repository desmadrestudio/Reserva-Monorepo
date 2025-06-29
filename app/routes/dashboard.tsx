import { Outlet } from "@remix-run/react";
import { Page } from "@shopify/polaris";

export default function DashboardLayout() {
  return (
    <Page title="Dashboard">
      <Outlet />
    </Page>
  );
}
