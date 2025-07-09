import { authenticate } from '~/shopify.server';
import { redirect } from '@remix-run/node';
import { getAppUrl } from "./url";

export async function requireUserId(request: Request) {
  const { session } = await authenticate.admin(request);
  if (!session) throw redirect(getAppUrl('/auth/login'));
  return session.shop;
}
