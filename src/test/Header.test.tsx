import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders the logo', () => {
    renderHeader();
    expect(screen.getByLabelText(/prashant mishra - home/i)).toBeInTheDocument();
  });

  it('renders navigation links on desktop', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('has a theme toggle button', () => {
    renderHeader();
    const themeButton = screen.getByLabelText(/switch to dark mode|switch to light mode/i);
    expect(themeButton).toBeInTheDocument();
  });

  it('has a mobile menu button', () => {
    renderHeader();
    const menuButton = screen.getByLabelText(/open menu|close menu/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    renderHeader();
    const menuButton = screen.getByLabelText(/open menu/i);
    
    fireEvent.click(menuButton);
    expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText(/close menu/i));
    expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
  });
});
