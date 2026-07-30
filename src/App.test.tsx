import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the empty document workspace', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /pdf field extractor/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/upload pdf/i)).toBeInTheDocument();
});
