import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/items.tsx';

test('items route exports loader', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.loader, 'function');
});
