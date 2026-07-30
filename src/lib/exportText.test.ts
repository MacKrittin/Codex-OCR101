import { expect, test } from 'vitest';
import { formatExportText } from './exportText';

test('formats values grouped under each filename', () => {
  expect(formatExportText([{ filename: 'one.pdf', fields: [{ name: 'Invoice', value: 'A-01' }] }])).toBe('one.pdf\nInvoice: A-01\n');
});
