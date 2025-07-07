import assert from 'node:assert/strict';
import test from 'node:test';

import HomeIndexPage, { links } from '../app/routes/_index.tsx';

test('home/index exports a component', () => {
  assert.equal(typeof HomeIndexPage, 'function');
});

test('home/index exports links', () => {
  assert.equal(typeof links, 'function');
});
