import { describe, expect, test } from 'vitest';
import { denormalizeRect, normalizeRect, rectanglesIntersect } from './geometry';

describe('geometry', () => {
  test('normalizes a crop against its canvas', () => {
    expect(normalizeRect({ x: 50, y: 25, width: 200, height: 100 }, 500, 250)).toEqual({ x: .1, y: .1, width: .4, height: .4 });
  });
  test('detects intersecting regions', () => expect(rectanglesIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 9, y: 9, width: 5, height: 5 })).toBe(true));
  test('restores normalized values at a different zoom', () => expect(denormalizeRect({ x: .1, y: .2, width: .3, height: .4 }, 1000, 500)).toEqual({ x: 100, y: 100, width: 300, height: 200 }));
});
