import assert from 'node:assert/strict';
import test from 'node:test';

import IndexPage from '../app/routes/dashboard/items/index.tsx';

test('dashboard/items index exports a component', () => {
  assert.equal(typeof IndexPage, 'function');
});
