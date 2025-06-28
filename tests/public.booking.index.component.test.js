import assert from 'node:assert/strict';
import test from 'node:test';

import PublicBookingIndex from '../app/routes/public/booking/index.tsx';

test('public/booking/index exports a component', () => {
  assert.equal(typeof PublicBookingIndex, 'function');
});
