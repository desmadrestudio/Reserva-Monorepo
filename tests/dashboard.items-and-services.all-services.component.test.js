import assert from 'node:assert/strict';
import test from 'node:test';

import AllServicesPage from '../app/routes/dashboard/items-and-services/all-services.tsx';

test('dashboard/items-and-services/all-services exports a component', () => {
  assert.equal(typeof AllServicesPage, 'function');
});
