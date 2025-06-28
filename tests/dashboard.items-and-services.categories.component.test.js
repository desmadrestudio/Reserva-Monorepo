import assert from 'node:assert/strict';
import test from 'node:test';

import CategoriesPage from '../app/routes/dashboard/items-and-services/categories.tsx';

test('dashboard/items-and-services/categories exports a component', () => {
  assert.equal(typeof CategoriesPage, 'function');
});
