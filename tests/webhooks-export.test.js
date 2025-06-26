import assert from 'node:assert/strict';
import test from 'node:test';

const routes = [
  '../app/routes/webhooks/app.uninstalled.ts',
  '../app/routes/webhooks/app.scopes_update.ts'
];

for (const route of routes) {
  test(`${route} exports action`, async () => {
    const mod = await import(route);
    assert.equal(typeof mod.action, 'function');
  });
}
