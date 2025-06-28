import assert from 'node:assert/strict';
import test from 'node:test';

import ReviewBooking from '../app/routes/booking.review.tsx';

test('booking.review exports a component', () => {
  assert.equal(typeof ReviewBooking, 'function');
});
