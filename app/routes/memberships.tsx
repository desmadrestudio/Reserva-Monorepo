import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/memberships");

export default function MembershipsRedirect() {
  return null;
}
