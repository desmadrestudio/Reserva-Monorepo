export const BASENAME = "/apps/reserva-app";

export function getAppUrl(path: string): string {
  if (path.startsWith("/")) {
    return BASENAME + path;
  }
  return `${BASENAME}/${path}`;
}
