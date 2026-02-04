import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Rendering', () => {
  test('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Independent React Frontend/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders the subtext message', () => {
    render(<App />);
    const subtext = screen.getByText(/Running on its own port/i);
    expect(subtext).toBeInTheDocument();
  });
});
