import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { FieldsPanel } from './FieldsPanel';
import { useState } from 'react';

test('edits a value before export', async () => {
  function Harness() { const [value, setValue] = useState('A-01'); return <FieldsPanel fields={[{ id: 'f-1', name: 'Invoice', page: 1, rect: { x: 0, y: 0, width: 1, height: 1 }, value, status: 'ready' }]} onFieldChange={(_, patch) => setValue(patch.value ?? value)} onDelete={vi.fn()} onExport={vi.fn()} />; }
  render(<Harness />);
  await userEvent.clear(screen.getByLabelText('Invoice value'));
  await userEvent.type(screen.getByLabelText('Invoice value'), 'Corrected');
  expect(screen.getByLabelText('Invoice value')).toHaveValue('Corrected');
});

test('disables export with no fields', () => {
  render(<FieldsPanel fields={[]} onFieldChange={vi.fn()} onDelete={vi.fn()} onExport={vi.fn()} />);
  expect(screen.getByRole('button', { name: /export extracted text/i })).toBeDisabled();
});

test('starts a named field before it has a crop', async () => {
  const onCreateField = vi.fn();
  render(<FieldsPanel fields={[]} onFieldChange={vi.fn()} onDelete={vi.fn()} onExport={vi.fn()} onCreateField={onCreateField} />);
  await userEvent.type(screen.getByLabelText('New field name'), 'Total');
  await userEvent.click(screen.getByRole('button', { name: 'Add field' }));
  expect(onCreateField).toHaveBeenCalledWith('Total');
});

test('requests expansion from the Capture details header', async () => {
  const onExpandedChange = vi.fn();
  render(<FieldsPanel fields={[]} onFieldChange={vi.fn()} onDelete={vi.fn()} onExport={vi.fn()} expanded={false} onExpandedChange={onExpandedChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'Expand Capture details' }));
  expect(onExpandedChange).toHaveBeenCalledWith(true);
});

test('shows a visible status while scanned text is being read', () => {
  render(<FieldsPanel fields={[{ id: 'f-scan', name: 'Receipt', page: 1, rect: { x: 0, y: 0, width: 1, height: 1 }, crops: [], value: '', status: 'extracting' }]} onFieldChange={vi.fn()} onDelete={vi.fn()} onExport={vi.fn()} />);
  expect(screen.getByText('Reading scanned text…')).toBeInTheDocument();
});
