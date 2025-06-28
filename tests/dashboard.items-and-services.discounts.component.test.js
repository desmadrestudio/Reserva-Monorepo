import assert from 'node:assert/strict';
import test from 'node:test';

import DiscountsPage from '../app/routes/dashboard/items-and-services/discounts.tsx';

test('dashboard/items-and-services/discounts exports a component', () => {
  assert.equal(typeof DiscountsPage, 'function');
});
