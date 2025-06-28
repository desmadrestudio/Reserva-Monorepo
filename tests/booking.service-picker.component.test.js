import assert from 'node:assert/strict';
import test from 'node:test';

import ServicePicker from '../app/routes/booking/service-picker.tsx';

test('booking/service-picker exports a component', () => {
  assert.equal(typeof ServicePicker, 'function');
});
