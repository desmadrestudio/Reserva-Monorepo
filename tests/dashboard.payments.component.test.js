import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard/payments/index.tsx';

test('dashboard/payments exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.loader, 'function');
});
