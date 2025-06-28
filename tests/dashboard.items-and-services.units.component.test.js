import assert from 'node:assert/strict';
import test from 'node:test';

import UnitsPage from '../app/routes/dashboard/items-and-services/units.tsx';

test('dashboard/items-and-services/units exports a component', () => {
  assert.equal(typeof UnitsPage, 'function');
});
