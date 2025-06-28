import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard/items/all-services.tsx';

test('dashboard/items/all-services exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.action, 'function');
});
