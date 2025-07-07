import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/items");

export default function ItemsRedirect() {
  return null;
}
