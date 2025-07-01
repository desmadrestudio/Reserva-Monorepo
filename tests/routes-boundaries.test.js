import assert from 'node:assert/strict';
import test from 'node:test';

const routes = [
  '../app/routes/dashboard/index.tsx',
  '../app/routes/dashboard/layout.tsx',
  '../app/routes/dashboard/appointments/index.tsx',
  '../app/routes/dashboard/calendar/index.tsx',
  '../app/routes/dashboard/settings/index.tsx',
  '../app/routes/booking/addons/index.tsx',
  '../app/routes/booking/category/index.tsx',
  '../app/routes/booking/duration/index.tsx',
  '../app/routes/booking/schedule/index.tsx',
  '../app/routes/booking/service/index.tsx',
  '../app/routes/booking/staff/index.tsx',
  '../app/routes/booking/review/index.tsx',
  '../app/routes/booking/confirm/index.tsx',
  '../app/routes/booking/cart/index.tsx',
  '../app/routes/booking/service-picker.tsx',
  '../app/routes/booking/contact.tsx',
  '../app/routes/booking/checkout.tsx',
  '../app/routes/booking/start/index.tsx',
  '../app/routes/booking/index.tsx',
  '../app/routes/services.tsx',
  '../app/routes/appointments.new._index.tsx',
  '../app/routes/classes/new/index.tsx',
  '../app/routes/events/new/index.tsx',
  '../app/routes/dashboard/checkout.tsx',
  '../app/routes/dashboard/services/index.tsx',
  '../app/routes/dashboard/customers/index.tsx',
  '../app/routes/dashboard/payments/index.tsx',
  '../app/routes/dashboard/staff/index.tsx',
  '../app/routes/dashboard/reports/index.tsx',
  '../app/routes/dashboard/items/index.tsx',
  '../app/routes/dashboard/items/all-items.tsx',
  '../app/routes/dashboard/items/all-services.tsx',
  '../app/routes/dashboard/items/resources.tsx',
  '../app/routes/dashboard/items/categories.tsx',
  '../app/routes/dashboard/items/modifiers.tsx',
  '../app/routes/dashboard/items/discounts.tsx',
  '../app/routes/dashboard/items/options.tsx',
  '../app/routes/dashboard/items/units.tsx',
  '../app/routes/public/booking/index.tsx'
];

for (const route of routes) {
  test(`${route} exports boundaries`, async () => {
    const mod = await import(route);
    assert.equal(typeof mod.ErrorBoundary, 'function');
    assert.equal(typeof mod.CatchBoundary, 'function');
  });
}
