import { redirect, type LoaderFunction } from "@remix-run/node";
import { getAppUrl } from "~/utils/url";

export const loader: LoaderFunction = async () => redirect(getAppUrl("/dashboard/memberships"));

export default function MembershipsRedirect() {
  return null;
}
