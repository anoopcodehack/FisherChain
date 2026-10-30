import { render, screen } from '@testing-library/react';
import App from './App';
import { Web3Provider } from './contexts/Web3Context';

test('renders FisherChain official navbar, brand and overview', () => {
  render(
    <Web3Provider>
      <App />
    </Web3Provider>
  );

  const brandElements = screen.getAllByText(/FisherChain/i);
  expect(brandElements.length).toBeGreaterThan(0);

  const overviewButton = screen.getByRole('button', { name: /Overview/i });
  expect(overviewButton).toBeInTheDocument();

  const traceButton = screen.getByRole('button', { name: /^Trace Batch$/i });
  expect(traceButton).toBeInTheDocument();
});
