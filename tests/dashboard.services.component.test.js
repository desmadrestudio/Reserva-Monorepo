import assert from 'node:assert/strict';
import test from 'node:test';

import DashboardServices from '../app/routes/dashboard.services.tsx';

test('dashboard/services exports a component', () => {
  assert.equal(typeof DashboardServices, 'function');
});
