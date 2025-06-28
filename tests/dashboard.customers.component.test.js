import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard/customers/index.tsx';

test('dashboard/customers exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.loader, 'function');
});
