import assert from 'node:assert/strict';
import test from 'node:test';

import AddOnsCard from '../app/components/booking/AddOnsCard';
import UpcomingAppointmentsCard from '../app/components/dashboard/UpcomingAppointmentsCard';
import DayTimeline from '../app/components/dashboard/DayTimeline';
import CreateMenu from '../app/components/dashboard/CreateMenu';

test('AddOnsCard exports a component', () => {
  assert.equal(typeof AddOnsCard, 'function');
});

test('UpcomingAppointmentsCard exports a component', () => {
  assert.equal(typeof UpcomingAppointmentsCard, 'function');
});

test('DayTimeline exports a component', () => {
  assert.equal(typeof DayTimeline, 'function');
});

test('CreateMenu exports a component', () => {
  assert.equal(typeof CreateMenu, 'function');
});
