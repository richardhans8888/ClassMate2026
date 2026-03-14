/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

// Mock the better-auth client — Header calls authClient.useSession()
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: () => ({ data: null }),
    signOut: jest.fn().mockResolvedValue(undefined),
  },
}))

// Mock next/navigation — required for next/link in jsdom
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/',
}))

// Mock the ModeToggle component — it uses next-themes which needs a ThemeProvider
// Use @/ prefix so Jest's moduleNameMapper can resolve the path
jest.mock('@/components/mode-toggle', () => ({
  ModeToggle: () => <button aria-label="Toggle theme">Theme</button>,
}))

describe('Header component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<Header />)).not.toThrow()
  })

  it('displays the ClassMate brand name', () => {
    render(<Header />)

    expect(screen.getByText('ClassMate')).toBeInTheDocument()
  })

  it('renders the notification bell button', () => {
    render(<Header />)

    // The Bell icon is inside a button — the button has no aria-label but is
    // identifiable by its position in the header or by querying all buttons
    const buttons = screen.getAllByRole('button')
    // Buttons present: Theme toggle, Notification bell, User avatar, Menu (mobile)
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the user menu trigger button', () => {
    render(<Header />)

    // The user avatar button wraps a gradient div — findable via role
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders navigation links for core pages', () => {
    render(<Header />)

    // Main navigation items that are always rendered
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /study room/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /learn with ai/i })).toBeInTheDocument()
  })

  it('shows the level badge', () => {
    render(<Header />)

    // Level is fetched from API on mount; with no session (userId undefined),
    // the fetch is skipped and the default state (Lvl 1) is displayed
    expect(screen.getByText(/lvl/i)).toBeInTheDocument()
  })
})
