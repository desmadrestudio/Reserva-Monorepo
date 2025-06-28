import assert from 'node:assert/strict';
import test from 'node:test';

const routes = [
  '../app/routes/dashboard._index.tsx',
  '../app/routes/dashboard.tsx',
  '../app/routes/dashboard.appointments.tsx',
  '../app/routes/dashboard.calendar.tsx',
  '../app/routes/dashboard.settings.tsx',
  '../app/routes/booking.addons.tsx',
  '../app/routes/booking.category.tsx',
  '../app/routes/booking.duration.tsx',
  '../app/routes/booking.schedule.tsx',
  '../app/routes/booking.service.tsx',
  '../app/routes/booking.staff.tsx',
  '../app/routes/booking.review.tsx',
  '../app/routes/booking.confirm.tsx',
  '../app/routes/booking.cart.tsx',
  '../app/routes/booking/service-picker.tsx',
  '../app/routes/booking/contact.tsx',
  '../app/routes/booking/checkout.tsx',
  '../app/routes/booking.start.tsx',
  '../app/routes/booking/index.tsx',
  '../app/routes/services.tsx',
  '../app/routes/appointments.new.tsx',
  '../app/routes/classes.new.tsx',
  '../app/routes/events.new.tsx',
  '../app/routes/dashboard/checkout.tsx',
  '../app/routes/dashboard.services.tsx',
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
