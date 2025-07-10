export const BASENAME = "/apps/reserva-app";

export function getAppUrl(path: string): string {
  if (path.startsWith("/")) {
    return BASENAME + path;
  }
  return `${BASENAME}/${path}`;
}

export function getRequestUrl(request: Request): URL {
  const host = request.headers.get("host");
  const base =
    process.env.SHOPIFY_APP_URL ||
    (host ? `http://${host}` : "http://localhost:3000");

  try {
    return new URL(request.url, base);
  } catch (e) {
    console.error("Invalid URL:", request.url, e);
    return new URL(base);
  }
}
