import assert from 'node:assert/strict';
import test from 'node:test';

const MODULE = '../app/routes/booking/contact.tsx';

function buildRequest(data) {
  const body = new URLSearchParams(data);
  return new Request('http://localhost/booking/contact', { method: 'POST', body });
}

test('contact action redirects with form fields', async () => {
  const { action } = await import(MODULE);
  const request = buildRequest({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '123',
  });
  const response = await action({ request });
  assert.equal(
    response.headers.get('Location'),
    '/booking/checkout?firstName=Jane&lastName=Doe&email=jane%40example.com&phone=123'
  );
});
