import assert from 'node:assert/strict';
import test from 'node:test';

import PublicIndexPage from '../app/routes/public/index.tsx';

test('public/index exports a component', () => {
  assert.equal(typeof PublicIndexPage, 'function');
});
