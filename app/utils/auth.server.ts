import { authenticate } from '~/shopify.server';
import { redirect } from '@remix-run/node';

export async function requireUserId(request: Request) {
  const { session } = await authenticate.admin(request);
  if (!session) throw redirect('/login');
  return session.shop;
}
