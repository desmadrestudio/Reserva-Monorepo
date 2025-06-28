import assert from 'node:assert/strict';
import test from 'node:test';

import SettingsPage from '../app/routes/dashboard/settings.tsx';

test('dashboard/settings exports a component', () => {
  assert.equal(typeof SettingsPage, 'function');
});
