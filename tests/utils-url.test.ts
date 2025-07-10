import assert from 'node:assert/strict';
import test from 'node:test';
import { getAppUrl, getRequestUrl } from '../app/utils/url';

test('getAppUrl adds basename', () => {
  assert.equal(getAppUrl('/foo'), '/apps/reserva-app/foo');
  assert.equal(getAppUrl('bar'), '/apps/reserva-app/bar');
});

test('getRequestUrl creates absolute URL', () => {
  const request = {
    url: '/test',
    headers: new Headers({ host: 'myshop.com' }),
  } as unknown as Request;
  const url = getRequestUrl(request);
  assert.equal(url.toString(), 'http://myshop.com/test');
});
