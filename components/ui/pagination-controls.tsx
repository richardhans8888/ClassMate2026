'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  isLoading?: boolean
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isLoading = false,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentPage <= 1 || isLoading}
        className="rounded-lg"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      <span className="text-muted-foreground text-sm">
        Page <span className="text-foreground font-medium">{currentPage}</span> of{' '}
        <span className="text-foreground font-medium">{totalPages}</span>
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentPage >= totalPages || isLoading}
        className="rounded-lg"
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
