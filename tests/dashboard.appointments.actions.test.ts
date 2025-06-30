import { describe, it, expect } from 'vitest';
import * as module from '../app/routes/dashboard/appointments/index.tsx';

describe('dashboard/appointments route', () => {
  it('exports a default component', () => {
    expect(typeof module.default).toBe('function');
  });

  it('does not define loader or action handlers', () => {
    expect(module.loader).toBeUndefined();
    expect(module.action).toBeUndefined();
  });
});
