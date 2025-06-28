import assert from 'node:assert/strict';
import test from 'node:test';

// Dynamically import the service so we can stub createAppointment
import * as appointmentService from '../app/services/appointment.server.js';

const CALENDAR_MODULE = '../app/routes/dashboard/calendar/index.tsx';

// Helper to build a request with form data
function buildRequest(data) {
  const body = new URLSearchParams(data);
  return new Request('http://localhost/dashboard/calendar', {
    method: 'POST',
    body,
  });
}

test('calendar action forwards booking fields', async () => {
  let received = null;
  appointmentService.createAppointment = async (payload) => {
    received = payload;
    return {};
  };

  const { action } = await import(CALENDAR_MODULE);
  const date = new Date().toISOString();
  const request = buildRequest({ date, time: '1:00 PM', customer: 'Jane' });
  const response = await action({ request });
  const json = await response.json();

  assert.equal(json.success, true);
  assert.ok(received);
  assert.equal(received.time, '1:00 PM');
  assert.equal(received.customer, 'Jane');
  assert.ok(received.date instanceof Date);
});
