import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Rendering', () => {
  // Test 1: Verifies the main heading exists in the DOM
  test('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Independent React Frontend/i);
    expect(heading).toBeInTheDocument();
  });

  // Test 2: Verifies specific descriptive text is present
  test('renders the subtext message', () => {
    render(<App />);
    const subtext = screen.getByText(/Running on its own port/i);
    expect(subtext).toBeInTheDocument();
  });
});
