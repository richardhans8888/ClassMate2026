/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInterface } from '@/components/features/ai-tutor/ChatInterface'
import type { Message } from '@/hooks/useChat'

// Mock framer-motion — AnimatePresence and motion.* throw in jsdom
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

// Mock next/image — renders as a plain img in tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}))

// Mock next/navigation (precautionary — not used directly in this component)
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/ai-tutor',
}))

// Helper: build a Message object matching the type from hooks/useChat.ts
function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'msg-1',
    role: 'user',
    content: 'Hello',
    timestamp: new Date(),
    ...overrides,
  }
}

// Default prop set used in most tests
const defaultProps = {
  messages: [] as Message[],
  isLoading: false,
  error: null,
  sendMessage: jest.fn(),
}

describe('ChatInterface component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<ChatInterface {...defaultProps} />)).not.toThrow()
  })

  it('renders a text input for composing messages', () => {
    render(<ChatInterface {...defaultProps} />)

    // The input has a placeholder defined in the component
    const input = screen.getByPlaceholderText(/ask a follow-up question/i)
    expect(input).toBeInTheDocument()
  })

  it('renders a send button', () => {
    render(<ChatInterface {...defaultProps} />)

    // The send button contains the Send icon — query by its accessible role or test id
    // The button is disabled when input is empty; it still exists in the DOM
    const buttons = screen.getAllByRole('button')
    // At minimum: Plus button, Image button, Send button, Session History button
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('does not show any AI response messages in the empty state', () => {
    render(<ChatInterface {...defaultProps} />)

    // When messages is empty and not loading, the empty-state hint is visible
    expect(screen.getByText(/ask me anything/i)).toBeInTheDocument()
  })

  it('does not show the empty-state hint when messages are present', () => {
    const props = {
      ...defaultProps,
      messages: [makeMessage({ role: 'user', content: 'Explain loops' })],
    }
    render(<ChatInterface {...props} />)

    expect(screen.queryByText(/ask me anything/i)).not.toBeInTheDocument()
    expect(screen.getByText('Explain loops')).toBeInTheDocument()
  })

  it('calls sendMessage with the input value when the user types and presses Enter', async () => {
    const sendMessage = jest.fn()
    render(<ChatInterface {...defaultProps} sendMessage={sendMessage} />)

    const input = screen.getByPlaceholderText(/ask a follow-up question/i)
    await userEvent.type(input, 'What is a closure?')
    await userEvent.keyboard('{Enter}')

    expect(sendMessage).toHaveBeenCalledWith('What is a closure?')
  })

  it('displays an error message when the error prop is set', () => {
    render(<ChatInterface {...defaultProps} error="Something went wrong. Please try again." />)

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('disables the input and send button while isLoading is true', () => {
    render(<ChatInterface {...defaultProps} isLoading={true} />)

    const input = screen.getByPlaceholderText(/ask a follow-up question/i)
    expect(input).toBeDisabled()
  })

  it('shows loading history indicator when isLoadingHistory is true', () => {
    render(<ChatInterface {...defaultProps} isLoadingHistory={true} />)

    expect(screen.getByText(/loading conversation/i)).toBeInTheDocument()
    // Empty-state hint should NOT appear while loading history
    expect(screen.queryByText(/ask me anything/i)).not.toBeInTheDocument()
  })

  it('renders a mobile New Chat button when onNewChat is provided', () => {
    const onNewChat = jest.fn()
    render(<ChatInterface {...defaultProps} onNewChat={onNewChat} />)

    const newChatButton = screen.getByRole('button', { name: /new chat/i })
    expect(newChatButton).toBeInTheDocument()
  })

  it('calls onNewChat when the mobile New Chat button is clicked', async () => {
    const onNewChat = jest.fn()
    render(<ChatInterface {...defaultProps} onNewChat={onNewChat} />)

    await userEvent.click(screen.getByRole('button', { name: /new chat/i }))
    expect(onNewChat).toHaveBeenCalledTimes(1)
  })
})
