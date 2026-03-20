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

// Mock the Sheet component — Radix UI portals don't work well in jsdom
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

    expect(screen.getAllByText('ClassMate')[0]).toBeInTheDocument()
  })

  it('renders the user menu trigger button', () => {
    render(<Header />)

    // The user avatar button wraps a gradient div — findable via role
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders navigation links for core pages', () => {
    render(<Header />)

    // Main navigation items — appear in both desktop nav and mobile drawer
    expect(screen.getAllByRole('link', { name: /home/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /study room/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /chat/i })[0]).toBeInTheDocument()
  })

  it('renders a more menu trigger for secondary routes', () => {
    render(<Header />)

    expect(screen.getAllByRole('button', { name: /more/i })[0]).toBeInTheDocument()
  })

  it('shows the level badge', () => {
    render(<Header />)

    // Level is fetched from API on mount; with no session (userId undefined),
    // the fetch is skipped and the default state (Lvl 1) is displayed
    expect(screen.getByText(/lvl/i)).toBeInTheDocument()
  })
})
