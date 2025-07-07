import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/memberships.tsx';

test('memberships route exports loader', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.loader, 'function');
});
