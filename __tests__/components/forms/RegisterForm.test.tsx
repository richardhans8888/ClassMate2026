/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/register/page'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}))

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/lib/auth-client', () => ({
  authClient: { signUp: { email: jest.fn() } },
}))

jest.mock('sonner', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

jest.mock('@/lib/avatar', () => ({
  getAvatarUrl: jest.fn(() => 'https://example.com/avatar.jpg'),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  } = {}
) {
  const name = overrides.name ?? 'John Doe'
  const email = overrides.email ?? 'john@example.com'
  const password = overrides.password ?? 'password123'
  const confirmPassword = overrides.confirmPassword ?? password

  if (name !== '') await user.type(screen.getByPlaceholderText('e.g. John Doe'), name)
  if (email !== '') await user.type(screen.getByPlaceholderText('you@example.com'), email)
  if (password !== '')
    await user.type(screen.getByPlaceholderText('At least 8 characters'), password)
  if (confirmPassword !== '')
    await user.type(screen.getByPlaceholderText('Repeat your password'), confirmPassword)
}

describe('RegisterPage', () => {
  it('renders name, email, password, and confirm password fields', () => {
    render(<RegisterPage />)

    expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument()
  })

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'password123')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
  })

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('e.g. John Doe'), 'John Doe')
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'password123')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
  })

  it('shows validation error for password shorter than 8 characters', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByPlaceholderText('e.g. John Doe'), 'John Doe')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'short')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'short')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument()
  })

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await fillForm(user, { confirmPassword: 'different123' })
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
  })

  it('calls signUp endpoint with correct payload on valid submit', async () => {
    jest
      .mocked(authClient.signUp.email)
      .mockResolvedValue({ data: { id: 'user-1' }, error: null } as never)
    const user = userEvent.setup()
    render(<RegisterPage />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
      )
    })
  })

  it('shows error toast if API returns error', async () => {
    jest.mocked(authClient.signUp.email).mockResolvedValue({
      data: null,
      error: { message: 'Email already in use' },
    } as never)
    const user = userEvent.setup()
    render(<RegisterPage />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already in use')
    })
  })

  it('disables submit button during submission', async () => {
    jest.mocked(authClient.signUp.email).mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()
    render(<RegisterPage />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled()
    })
  })

  it('redirects to dashboard on successful registration', async () => {
    jest
      .mocked(authClient.signUp.email)
      .mockResolvedValue({ data: { id: 'user-1' }, error: null } as never)
    const user = userEvent.setup()
    render(<RegisterPage />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })
})
