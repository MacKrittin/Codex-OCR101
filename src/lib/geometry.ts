import type { NormalizedRect } from '../types';

export interface PixelRect { x: number; y: number; width: number; height: number; }

export const normalizeRect = (rect: PixelRect, width: number, height: number): NormalizedRect => ({ x: rect.x / width, y: rect.y / height, width: rect.width / width, height: rect.height / height });
export const denormalizeRect = (rect: NormalizedRect, width: number, height: number): PixelRect => ({ x: rect.x * width, y: rect.y * height, width: rect.width * width, height: rect.height * height });
export const rectanglesIntersect = (a: PixelRect, b: PixelRect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
