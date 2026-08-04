import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { PdfCanvas } from './PdfCanvas';

vi.mock('pdfjs-dist', () => ({ GlobalWorkerOptions: {}, getDocument: vi.fn(() => ({ promise: new Promise(() => {}) })) }));

test('reports the matching field and crop when a crop cancel button is pressed', async () => {
  const onDeleteCrop = vi.fn();
  render(<PdfCanvas document={{ id: 'doc-1', filename: 'sample.pdf', data: new ArrayBuffer(8), pageCount: 1, fields: [] }} fields={[{ id: 'field-1', name: 'Invoice', page: 1, crops: [{ id: 'crop-1', page: 1, rect: { x: .1, y: .1, width: .2, height: .2 }, value: 'A-01' }], value: 'A-01', status: 'ready' }]} onBeginCrop={vi.fn()} onFinishCrop={vi.fn()} onDeleteCrop={onDeleteCrop} />);
  await userEvent.click(screen.getByRole('button', { name: 'Remove crop for Invoice' }));
  expect(onDeleteCrop).toHaveBeenCalledWith('field-1', 'crop-1');
});
