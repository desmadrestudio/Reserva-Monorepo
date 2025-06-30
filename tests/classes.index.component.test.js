import assert from 'node:assert/strict';
import test from 'node:test';

import ClassesIndexPage from '../app/routes/classes/index.tsx';

test('classes/index exports a component', () => {
  assert.equal(typeof ClassesIndexPage, 'function');
});
