import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard/items-and-services/all-items.tsx';

test('dashboard/items-and-services/all-items exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.action, 'function');
});
