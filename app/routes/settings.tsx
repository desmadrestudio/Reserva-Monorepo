import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/settings");

export default function SettingsRedirect() {
  return null;
}
