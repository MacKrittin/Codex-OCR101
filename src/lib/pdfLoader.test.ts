import { expect, test } from 'vitest';
import { getPdfLoadOptions } from './pdfLoader';

test('provides the bundled decoder directory for scanned PDF images', () => {
  const data = new ArrayBuffer(8);
  expect(getPdfLoadOptions(data)).toEqual({ data, wasmUrl: '/' });
});
