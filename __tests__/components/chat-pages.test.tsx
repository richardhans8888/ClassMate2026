/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatPage from '@/app/(main)/chat/page'
import ChatConversationPage from '@/app/(main)/chat/[userId]/page'

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
})

describe('Chat pages integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('renders conversation list results from API', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        conversations: [
          {
            userId: 'user-2',
            participant: {
              id: 'user-2',
              email: 'alice@example.com',
              displayName: 'Alice',
              avatarUrl: null,
            },
            lastMessage: {
              id: 'message-1',
              content: 'Hey there',
              createdAt: '2026-03-20T10:00:00.000Z',
              senderId: 'user-2',
            },
            unreadCount: 2,
          },
        ],
      }),
    })

    render(<ChatPage />)

    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Hey there')).toBeInTheDocument()
  })

  it('renders error state when conversation list request fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unable to load conversations.' }),
    })

    render(<ChatPage />)

    expect(await screen.findByText('Unable to load conversations.')).toBeInTheDocument()
  })

  it('sends a message and renders it in the thread', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          participant: {
            id: 'user-2',
            email: 'bob@example.com',
            displayName: 'Bob',
            avatarUrl: null,
          },
          messages: [],
          pagination: { limit: 50, nextCursor: null },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ updatedCount: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: {
            id: 'message-new',
            senderId: 'user-1',
            recipientId: 'user-2',
            content: 'Hello Bob',
            isRead: false,
            createdAt: '2026-03-20T11:00:00.000Z',
          },
        }),
      })

    render(<ChatConversationPage params={{ userId: 'user-2' }} />)

    expect(await screen.findByText('Bob')).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Type a message...'), 'Hello Bob{enter}')

    expect(await screen.findByText('Hello Bob')).toBeInTheDocument()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/messages/conversations/user-2',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
