import assert from 'node:assert/strict';
import test from 'node:test';

const MODULE = '../app/routes/appointments.new.tsx';

function buildRequest(search) {
  const url = 'http://localhost/appointments/new' + (search ? `?${search}` : '');
  return new Request(url);
}

test('loader returns initialDate from query param', async () => {
  const { loader } = await import(MODULE);
  const date = '2024-05-20';
  const response = await loader({ request: buildRequest(`date=${date}`) });
  const data = await response.json();
  assert.ok(data.initialDate.startsWith(date));
});
