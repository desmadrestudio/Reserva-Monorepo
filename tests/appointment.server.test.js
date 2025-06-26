import assert from 'node:assert/strict';
import test from 'node:test';
import { getAppointments, createAppointment } from '../app/services/appointment.server';

test('getAppointments calls underlying db', async () => {
  let called = false;
  const fakeDb = {
    appointment: {
      findMany: async () => {
        called = true;
        return [];
      },
    },
  };

  await getAppointments({ start: new Date(), end: new Date() }, fakeDb);
  assert.equal(called, true);
});

test('createAppointment calls underlying db', async () => {
  let called = false;
  const fakeDb = {
    appointment: {
      create: async ({ data }) => {
        called = true;
        return data;
      },
    },
  };

  const result = await createAppointment({ date: new Date(), time: '1', customer: 'c' }, fakeDb);
  assert.equal(called, true);
  assert.equal(result.customer, 'c');
});
