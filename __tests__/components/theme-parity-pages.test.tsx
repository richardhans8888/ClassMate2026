/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ForumCard } from '@/components/features/forums/ForumCard'
import { MaterialCard } from '@/components/features/materials/MaterialCard'

describe('Theme parity component guards', () => {
  it('forum card keeps dark-mode container and text classes', () => {
    const { container } = render(
      <ForumCard
        id="post-1"
        title="Need help with calculus"
        author="Alice"
        category="math"
        replies={2}
        views={10}
        upvotes={3}
        tags={['calculus']}
        createdAt="today"
      />
    )

    expect(screen.getByText('Need help with calculus')).toBeInTheDocument()
    expect(container.innerHTML).toContain('dark:bg-gray-800')
    expect(container.innerHTML).toContain('dark:text-white')
  })

  it('material card keeps dark-mode container and metadata classes', () => {
    const { container } = render(
      <MaterialCard
        id="mat-1"
        title="Linear Algebra Notes"
        author="Bob"
        subject="Mathematics"
        type="PDF"
        rating={4.8}
        downloads={120}
        uploadedAt="today"
      />
    )

    expect(screen.getByText('Linear Algebra Notes')).toBeInTheDocument()
    expect(container.innerHTML).toContain('dark:bg-gray-800')
    expect(container.innerHTML).toContain('dark:text-white')
  })
})
