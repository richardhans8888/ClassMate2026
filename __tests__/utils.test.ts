// lib/__tests__/utils.test.ts
import { cn } from '@/lib/utils'

describe('cn() utility', () => {
  it('returns an empty string when called with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('returns a single class name unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('joins multiple class names with a space', () => {
    expect(cn('flex', 'items-center', 'gap-4')).toBe('flex items-center gap-4')
  })

  it('ignores falsy values (false, null, undefined)', () => {
    expect(cn('p-4', false, null, undefined, 'mt-2')).toBe('p-4 mt-2')
  })

  it('deduplicates conflicting Tailwind classes — last one wins', () => {
    // tailwind-merge resolves conflicts: p-4 and p-2 both set padding;
    // the last declaration wins
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('handles conditional class names from an object', () => {
    const isActive = true
    const isDisabled = false
    expect(cn({ 'bg-blue-500': isActive, 'opacity-50': isDisabled })).toBe('bg-blue-500')
  })
})
