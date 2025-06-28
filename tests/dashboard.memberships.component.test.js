import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard.memberships.tsx';

test('dashboard/memberships exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.loader, 'function');
});
