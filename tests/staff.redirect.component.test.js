import assert from 'node:assert/strict';
import test from 'node:test';

import * as route from '../app/routes/staff.tsx';

test('staff route exports loader', () => {
  assert.equal(typeof route.default, 'function');
  assert.equal(typeof route.loader, 'function');
});
