import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { Web3Provider } from './contexts/Web3Context';

describe('FisherChain Enterprise Platform Frontend Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderApp = () => {
    render(
      <Web3Provider>
        <App />
      </Web3Provider>
    );
    const nav = screen.getByRole('navigation', { name: /Main Navigation/i });
    return { nav };
  };

  test('renders FisherChain official navbar, brand and overview', () => {
    const { nav } = renderApp();

    const brandElements = screen.getAllByText(/FisherChain/i);
    expect(brandElements.length).toBeGreaterThan(0);

    const overviewButton = within(nav).getByRole('button', { name: /Overview/i });
    expect(overviewButton).toBeInTheDocument();

    const traceButton = within(nav).getByRole('button', { name: /^Trace Batch$/i });
    expect(traceButton).toBeInTheDocument();
  });

  test('navigates to Trace Batch (ConsumerLookup) tab seamlessly', () => {
    const { nav } = renderApp();

    const traceNavButton = within(nav).getByRole('button', { name: /^Trace Batch$/i });
    fireEvent.click(traceNavButton);

    expect(screen.getByText(/Seafood Batch Provenance Explorer/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter batch ID/i)).toBeInTheDocument();
  });

  test('navigates to Catch Registry tab and shows wallet connection prompt when disconnected', () => {
    const { nav } = renderApp();

    const catchNavButton = within(nav).getByRole('button', { name: /Catch Registry/i });
    fireEvent.click(catchNavButton);

    expect(screen.getByText(/Vessel Wallet Authentication Required/i)).toBeInTheDocument();
  });

  test('navigates to Logistics tab and shows wallet connection prompt when disconnected', () => {
    const { nav } = renderApp();

    const logisticsNavButton = within(nav).getByRole('button', { name: /Logistics/i });
    fireEvent.click(logisticsNavButton);

    expect(screen.getByText(/Logistics Wallet Authentication Required/i)).toBeInTheDocument();
  });

  test('navigates to Retail Inventory tab and shows wallet connection prompt when disconnected', () => {
    const { nav } = renderApp();

    const retailNavButton = within(nav).getByRole('button', { name: /Retail Inventory/i });
    fireEvent.click(retailNavButton);

    expect(screen.getByText(/Storefront Wallet Authentication Required/i)).toBeInTheDocument();
  });

  test('navigates to Governance tab and shows wallet connection prompt when disconnected', () => {
    const { nav } = renderApp();

    const adminNavButton = within(nav).getByRole('button', { name: /Governance/i });
    fireEvent.click(adminNavButton);

    expect(screen.getByText(/Governance Deployer Authentication Required/i)).toBeInTheDocument();
  });

  test('navigates to System Specs (AboutPage) and displays architecture details', () => {
    const { nav } = renderApp();

    const specsNavButton = within(nav).getByRole('button', { name: /System Specs/i });
    fireEvent.click(specsNavButton);

    expect(screen.getByText(/FisherChain Protocol & System Architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/registerCatch\(\)/i)).toBeInTheDocument();
    expect(screen.getByText(/transferBatch\(\)/i)).toBeInTheDocument();
  });
});
