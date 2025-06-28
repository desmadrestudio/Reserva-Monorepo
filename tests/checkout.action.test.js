import assert from 'node:assert/strict';
import test from 'node:test';
import * as shopify from '../app/shopify.server.js';

const MODULE = '../app/routes/dashboard/checkout.tsx';

function buildRequest(cart) {
  const body = new URLSearchParams();
  body.append('cart', JSON.stringify(cart));
  return new Request('http://localhost/dashboard/checkout', { method: 'POST', body });
}

test('checkout action redirects to checkout url', async () => {
  const checkoutUrl = 'https://shop.myshopify.com/checkout';
  shopify.authenticate.admin = async () => ({
    admin: {
      graphql: async () => ({
        json: async () => ({ data: { checkoutCreate: { checkout: { webUrl: checkoutUrl } } } })
      })
    }
  });

  const { action } = await import(MODULE);
  const cart = [{ variantId: '1', quantity: 2 }];
  const response = await action({ request: buildRequest(cart) });
  assert.equal(response.headers.get('Location'), checkoutUrl);
});
