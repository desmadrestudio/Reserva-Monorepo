import { LoginErrorType, type LoginErrors } from "@shopify/shopify-app-remix/server";

export function loginErrorMessage(loginErrors?: LoginErrors) {
  if (loginErrors?.shop === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  }

  if (loginErrors?.shop === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }

  return {};
}