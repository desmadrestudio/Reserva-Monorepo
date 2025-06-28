import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard/items-and-services/options.tsx';

test('dashboard/items-and-services/options exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.action, 'function');
});
