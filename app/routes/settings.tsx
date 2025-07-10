import { redirect, type LoaderFunction } from "@remix-run/node";
import { getAppUrl } from "~/utils/url";

export const loader: LoaderFunction = async () => redirect(getAppUrl("/dashboard/settings"));

export default function SettingsRedirect() {
  return null;
}
