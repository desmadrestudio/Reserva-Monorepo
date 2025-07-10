import assert from 'node:assert/strict';
import test from 'node:test';

import DashboardIndex from '../app/routes/dashboard/index.tsx';

test('dashboard index exports a component', () => {
  assert.equal(typeof DashboardIndex, 'function');
});
