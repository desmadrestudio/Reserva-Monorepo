import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/staff");

export default function StaffRedirect() {
  return null;
}
