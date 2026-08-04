import type { NormalizedRect } from '../types';
import { denormalizeRect, rectanglesIntersect } from './geometry';

type Viewport = { width: number; height: number; convertToViewportPoint(x: number, y: number): [number, number] };
type Page = { getTextContent(): Promise<{ items: Array<{ str?: string; transform: number[]; width?: number; height?: number }> }>; render(options: { canvasContext: CanvasRenderingContext2D; viewport: Viewport }): { promise: Promise<void> } };

function itemBounds(item: { transform: number[]; width?: number; height?: number }, viewport: Viewport) { const [x, y] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]); return { x, y: y - Math.abs(item.height ?? item.transform[3] ?? 12), width: Math.abs(item.width ?? item.transform[0] ?? 0), height: Math.abs(item.height ?? item.transform[3] ?? 12) }; }
export async function extractTextFromRegion(page: Page, rect: NormalizedRect, viewport: Viewport) {
  const selected = denormalizeRect(rect, viewport.width, viewport.height);
  const text = await page.getTextContent();
  const matching = text.items.map((item) => ({ item, bounds: itemBounds(item, viewport) })).filter(({ bounds }) => rectanglesIntersect(bounds, selected)).sort((a, b) => a.bounds.y - b.bounds.y || a.bounds.x - b.bounds.x).map(({ item }) => item.str?.trim()).filter(Boolean).join(' ');
  if (matching) return matching;
  const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
  const crop = document.createElement('canvas'); crop.width = Math.max(1, Math.ceil(selected.width)); crop.height = Math.max(1, Math.ceil(selected.height)); crop.getContext('2d')!.drawImage(canvas, selected.x, selected.y, selected.width, selected.height, 0, 0, crop.width, crop.height);
  const { createWorker } = await import('tesseract.js'); const worker = await createWorker('eng+tha'); try { return (await worker.recognize(crop)).data.text.trim(); } finally { await worker.terminate(); }
}
