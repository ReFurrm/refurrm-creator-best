import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders the App component', () => {
    render(<App />);
    expect(screen.getByText('ReFurrm Shops')).toBeInTheDocument();
  });

  it('renders the NotFound component for a non-existing route', () => {
    render(
      <MemoryRouter initialEntries={['/non-existing-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
  });
});
