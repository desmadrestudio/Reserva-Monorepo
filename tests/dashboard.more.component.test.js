import assert from 'node:assert/strict';
import test from 'node:test';

import MorePage from '../app/routes/dashboard/more/index.tsx';

test('dashboard/more exports a component', () => {
  assert.equal(typeof MorePage, 'function');
});
