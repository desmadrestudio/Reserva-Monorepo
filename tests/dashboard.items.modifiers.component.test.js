import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/dashboard/items/modifiers.tsx';

test('dashboard/items/modifiers exports handlers', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.action, 'function');
});
