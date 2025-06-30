import assert from 'node:assert/strict';
import test from 'node:test';

import HomeIndexPage from '../app/routes/_index.tsx';

test('home/index exports a component', () => {
  assert.equal(typeof HomeIndexPage, 'function');
});
