import assert from 'node:assert/strict';
import test from 'node:test';

import OptionsPage from '../app/routes/dashboard/items-and-services/options.tsx';

test('dashboard/items-and-services/options exports a component', () => {
  assert.equal(typeof OptionsPage, 'function');
});
