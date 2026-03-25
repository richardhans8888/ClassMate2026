import { formatDate } from '@/lib/format'

describe('formatDate', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-03-25T12:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Just now (< 1 minute ago)', () => {
    it('returns "Just now" for current time', () => {
      const result = formatDate('2026-03-25T12:00:00.000Z')
      expect(result).toBe('Just now')
    })

    it('returns "Just now" for 30 seconds ago', () => {
      const result = formatDate('2026-03-25T11:59:30.000Z')
      expect(result).toBe('Just now')
    })

    it('returns "Just now" for 59 seconds ago', () => {
      const result = formatDate('2026-03-25T11:59:01.000Z')
      expect(result).toBe('Just now')
    })
  })

  describe('minutes ago (1–59 minutes ago)', () => {
    it('returns "1 min ago" for exactly 1 minute ago', () => {
      const result = formatDate('2026-03-25T11:59:00.000Z')
      expect(result).toBe('1 min ago')
    })

    it('returns "30 min ago" for 30 minutes ago', () => {
      const result = formatDate('2026-03-25T11:30:00.000Z')
      expect(result).toBe('30 min ago')
    })

    it('returns "59 min ago" for 59 minutes ago', () => {
      const result = formatDate('2026-03-25T11:01:00.000Z')
      expect(result).toBe('59 min ago')
    })
  })

  describe('hours ago (1–23 hours ago)', () => {
    it('returns "1 hour ago" (singular) for exactly 1 hour ago', () => {
      const result = formatDate('2026-03-25T11:00:00.000Z')
      expect(result).toBe('1 hour ago')
    })

    it('returns "2 hours ago" (plural) for 2 hours ago', () => {
      const result = formatDate('2026-03-25T10:00:00.000Z')
      expect(result).toBe('2 hours ago')
    })

    it('returns "23 hours ago" for 23 hours ago', () => {
      const result = formatDate('2026-03-24T13:00:00.000Z')
      expect(result).toBe('23 hours ago')
    })
  })

  describe('days ago (1–6 days ago)', () => {
    it('returns "1 day ago" (singular) for exactly 1 day ago', () => {
      const result = formatDate('2026-03-24T12:00:00.000Z')
      expect(result).toBe('1 day ago')
    })

    it('returns "2 days ago" (plural) for 2 days ago', () => {
      const result = formatDate('2026-03-23T12:00:00.000Z')
      expect(result).toBe('2 days ago')
    })

    it('returns "6 days ago" for 6 days ago', () => {
      const result = formatDate('2026-03-19T12:00:00.000Z')
      expect(result).toBe('6 days ago')
    })
  })

  describe('locale date string (7+ days ago)', () => {
    it('returns a locale date string for exactly 7 days ago', () => {
      const dateStr = '2026-03-18T12:00:00.000Z'
      const result = formatDate(dateStr)
      const expected = new Date(dateStr).toLocaleDateString()
      expect(result).toBe(expected)
    })

    it('returns a locale date string for 30 days ago', () => {
      const dateStr = '2026-02-23T12:00:00.000Z'
      const result = formatDate(dateStr)
      const expected = new Date(dateStr).toLocaleDateString()
      expect(result).toBe(expected)
    })

    it('returns a locale date string for a date 1 year ago', () => {
      const dateStr = '2025-03-25T12:00:00.000Z'
      const result = formatDate(dateStr)
      const expected = new Date(dateStr).toLocaleDateString()
      expect(result).toBe(expected)
    })
  })
})
