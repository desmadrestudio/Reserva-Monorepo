import assert from 'node:assert/strict';
import test from 'node:test';

import AddOnsCard from '../app/components/booking/AddOnsCard';
import UpcomingAppointmentsCard from '../app/components/dashboard/UpcomingAppointmentsCard';

test('AddOnsCard exports a component', () => {
  assert.equal(typeof AddOnsCard, 'function');
});

test('UpcomingAppointmentsCard exports a component', () => {
  assert.equal(typeof UpcomingAppointmentsCard, 'function');
});
