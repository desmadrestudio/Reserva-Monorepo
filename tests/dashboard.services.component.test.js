import assert from 'node:assert/strict';
import test from 'node:test';

import DashboardServices, { action, loader } from '../app/routes/dashboard.services.tsx';

test('dashboard/services exports a component', () => {
  assert.equal(typeof DashboardServices, 'function');
});

test('dashboard/services exports action and loader', () => {
  assert.equal(typeof action, 'function');
  assert.equal(typeof loader, 'function');
});
