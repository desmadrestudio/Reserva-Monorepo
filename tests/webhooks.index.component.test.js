import assert from 'node:assert/strict';
import test from 'node:test';

import WebhooksIndexPage from '../app/routes/webhooks/index.tsx';

test('webhooks/index exports a component', () => {
  assert.equal(typeof WebhooksIndexPage, 'function');
});
