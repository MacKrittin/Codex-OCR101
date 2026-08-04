import { expect, test } from 'vitest';
import { createId } from './createId';

test('uses randomUUID when the browser provides it', () => {
  expect(createId({ randomUUID: () => 'secure-id' })).toBe('secure-id');
});

test('creates a fallback id when randomUUID is unavailable on HTTP', () => {
  expect(createId({})).toMatch(/^id-[a-z0-9-]+$/);
});
