import assert from 'node:assert/strict';
import test from 'node:test';

import AllItemsPage from '../app/routes/dashboard/items-and-services/all-items.tsx';

test('dashboard/items-and-services/all-items exports a component', () => {
  assert.equal(typeof AllItemsPage, 'function');
});
