import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { DocumentRail } from './DocumentRail';

test('removes only the document selected with its delete control', async () => {
  const onRemove = vi.fn();
  render(<DocumentRail documents={[{ id: 'one', filename: 'one.pdf', data: new ArrayBuffer(0), pageCount: 1, fields: [] }]} onUpload={vi.fn()} onSelect={vi.fn()} onRemove={onRemove} />);
  await userEvent.click(screen.getByRole('button', { name: 'Remove one.pdf' }));
  expect(onRemove).toHaveBeenCalledWith('one');
});
