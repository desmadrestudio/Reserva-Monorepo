import assert from 'node:assert/strict';
import test from 'node:test';

import DashboardLayout from '../app/routes/dashboard/layout.tsx';

test('dashboard layout exports a component', () => {
  assert.equal(typeof DashboardLayout, 'function');
});
