import assert from 'node:assert/strict';
import test from 'node:test';

import ResourcesPage from '../app/routes/dashboard/items-and-services/resources.tsx';

test('dashboard/items-and-services/resources exports a component', () => {
  assert.equal(typeof ResourcesPage, 'function');
});
