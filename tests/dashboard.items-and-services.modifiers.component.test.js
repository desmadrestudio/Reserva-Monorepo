import assert from 'node:assert/strict';
import test from 'node:test';

import ModifiersPage from '../app/routes/dashboard/items-and-services/modifiers.tsx';

test('dashboard/items-and-services/modifiers exports a component', () => {
  assert.equal(typeof ModifiersPage, 'function');
});
