import assert from 'node:assert/strict';
import test from 'node:test';
import * as shopify from '../app/lib/shopify.server.js';
import { prisma } from '../app/lib/prisma.server.js';

const MODULE = '../app/routes/booking/checkout.tsx';

function buildRequest(bookings, contact) {
  const body = new URLSearchParams();
  body.append('bookings', JSON.stringify(bookings));
  body.append('firstName', contact.firstName);
  body.append('lastName', contact.lastName);
  body.append('email', contact.email);
  body.append('phone', contact.phone);
  return new Request('http://localhost/booking/checkout', { method: 'POST', body });
}

test('booking checkout redirects to Shopify checkout', async () => {
  const checkoutUrl = 'https://shop.myshopify.com/checkout';
  shopify.shopifyFetch = async () => ({
    checkoutCreate: { checkout: { webUrl: checkoutUrl } }
  });
  prisma.service.findUnique = async () => ({ variantId: 'gid://variant/1' });

  const { action } = await import(MODULE);
  const bookings = [{ id: '1', serviceId: 'svc1' }];
  const contact = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '123' };
  const response = await action({ request: buildRequest(bookings, contact) });
  assert.equal(response.headers.get('Location'), checkoutUrl);
});
