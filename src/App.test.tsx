import { render, screen } from '@testing-library/react';
import App, { createDefaultFields } from './App';

test('shows the empty document workspace', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /pdf field extractor/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/upload pdf/i)).toBeInTheDocument();
});

test('creates the standard shipping fields in order', () => {
  expect(createDefaultFields().map((field) => field.name)).toEqual([
    'Shipper', 'Consignee', 'Notify Party', 'Description of Goods', 'Shipping Marks', 'Total', 'Weight',
  ]);
});
