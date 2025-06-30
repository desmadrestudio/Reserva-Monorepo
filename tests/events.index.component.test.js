import assert from 'node:assert/strict';
import test from 'node:test';

import EventsIndexPage from '../app/routes/events/index.tsx';

test('events/index exports a component', () => {
  assert.equal(typeof EventsIndexPage, 'function');
});
