import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the App component', () => {
    render(<App />);
    expect(screen.getByText('ReFurrm')).toBeInTheDocument();
  });

  it('renders the NotFound component for a non-existing route', () => {
    window.history.pushState({}, 'Test page', '/non-existing-route');
    render(<App />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
