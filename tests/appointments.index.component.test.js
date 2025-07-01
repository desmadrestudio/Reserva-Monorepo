import assert from 'node:assert/strict';
import test from 'node:test';

import AppointmentsIndexPage from '../app/routes/appointments._index.tsx';

test('appointments/index exports a component', () => {
  assert.equal(typeof AppointmentsIndexPage, 'function');
});
