import assert from 'node:assert/strict';
import test from 'node:test';

import AuthIndexPage from '../app/routes/auth/index.tsx';

test('auth/index exports a component', () => {
  assert.equal(typeof AuthIndexPage, 'function');
});
