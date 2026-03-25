import { toISO, buildMonthMatrix } from '@/lib/calendar'

describe('toISO', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const result = toISO(2026, 2, 25) // month 2 = March (0-indexed)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns the correct date for a mid-month date', () => {
    expect(toISO(2026, 2, 15)).toBe('2026-03-15')
  })

  it('returns the correct date for January 1st', () => {
    expect(toISO(2026, 0, 1)).toBe('2026-01-01')
  })

  it('returns the correct date for December 31st', () => {
    expect(toISO(2026, 11, 31)).toBe('2026-12-31')
  })

  it('returns the correct date for the last day of February in a leap year', () => {
    expect(toISO(2024, 1, 29)).toBe('2024-02-29')
  })

  it('pads month and day with leading zeros', () => {
    const result = toISO(2026, 0, 5)
    expect(result).toBe('2026-01-05')
  })

  it('produces a 10-character string', () => {
    const result = toISO(2026, 2, 25)
    expect(result).toHaveLength(10)
  })
})

describe('buildMonthMatrix', () => {
  it('always produces exactly 42 cells', () => {
    const matrix = buildMonthMatrix(2026, 2) // March 2026
    expect(matrix).toHaveLength(42)
  })

  it('produces exactly 42 cells for a month starting on Sunday', () => {
    // Find a month starting on Sunday: January 2023 starts on Sunday
    const matrix = buildMonthMatrix(2023, 0)
    expect(matrix).toHaveLength(42)
  })

  it('produces exactly 42 cells for a month starting on Saturday', () => {
    // October 2022 starts on Saturday
    const matrix = buildMonthMatrix(2022, 9)
    expect(matrix).toHaveLength(42)
  })

  it('each cell has year, month, and day properties', () => {
    const matrix = buildMonthMatrix(2026, 2)
    matrix.forEach((cell) => {
      expect(cell).toHaveProperty('year')
      expect(cell).toHaveProperty('month')
      expect(cell).toHaveProperty('day')
    })
  })

  it('contains all days of the target month', () => {
    const matrix = buildMonthMatrix(2026, 2) // March = 31 days
    const marchCells = matrix.filter((c) => c.year === 2026 && c.month === 2)
    expect(marchCells).toHaveLength(31)
    const days = marchCells.map((c) => c.day).sort((a, b) => a - b)
    expect(days).toEqual(Array.from({ length: 31 }, (_, i) => i + 1))
  })

  it('pads with previous month days before the first cell of target month', () => {
    // March 2026 starts on Sunday (day 0), so no padding from previous month
    // Use a month that starts mid-week. June 2026 starts on Monday (day 1).
    const matrix = buildMonthMatrix(2026, 5) // June 2026
    // First cell should be the last day of May (day 0 = Sunday)
    const firstCell = matrix[0]
    // June starts on Monday, so index 0 is Sunday = last day of May
    expect(firstCell.month).toBe(4) // May
    expect(firstCell.year).toBe(2026)
  })

  it('pads with next month days after last day of target month', () => {
    // March 2026: 31 days, starts on Sunday (dow=0)
    // Cells 0-30 = March 1-31, cells 31-41 = next month (April)
    const matrix = buildMonthMatrix(2026, 2)
    const aprilCells = matrix.filter((c) => c.month === 3 && c.year === 2026)
    expect(aprilCells.length).toBeGreaterThan(0)
    // They should be sequential starting from 1
    const days = aprilCells.map((c) => c.day)
    expect(days[0]).toBe(1)
  })

  it('handles December to January year boundary for next month padding', () => {
    // December 2025: starts on Monday
    const matrix = buildMonthMatrix(2025, 11) // December
    const janCells = matrix.filter((c) => c.month === 0 && c.year === 2026)
    expect(janCells.length).toBeGreaterThan(0)
    expect(janCells[0].day).toBe(1)
    const decCells = matrix.filter((c) => c.month === 11 && c.year === 2025)
    expect(decCells).toHaveLength(31)
  })

  it('handles January year boundary for previous month padding', () => {
    // January 2026 starts on Thursday (dow=4), so first 4 cells are December 2025
    const matrix = buildMonthMatrix(2026, 0) // January 2026
    const firstCell = matrix[0]
    // January 2026 starts on Thursday (dow=4), so first 4 cells are Dec 28–31 2025
    expect(firstCell.month).toBe(11) // December
    expect(firstCell.year).toBe(2025)
    const janCells = matrix.filter((c) => c.month === 0 && c.year === 2026)
    expect(janCells).toHaveLength(31)
  })

  it('first cells in matrix are previous month when month does not start on Sunday', () => {
    // April 2026 starts on Wednesday (dow=3)
    const matrix = buildMonthMatrix(2026, 3) // April
    // First 3 cells should be from March 2026
    const marchPaddingCells = matrix.slice(0, 3)
    marchPaddingCells.forEach((cell) => {
      expect(cell.month).toBe(2) // March
      expect(cell.year).toBe(2026)
    })
    // 4th cell (index 3) should be April 1
    expect(matrix[3]).toEqual({ year: 2026, month: 3, day: 1 })
  })

  it('handles February in a leap year correctly', () => {
    const matrix = buildMonthMatrix(2024, 1) // February 2024 (leap year)
    const febCells = matrix.filter((c) => c.year === 2024 && c.month === 1)
    expect(febCells).toHaveLength(29)
  })

  it('handles February in a non-leap year correctly', () => {
    const matrix = buildMonthMatrix(2026, 1) // February 2026
    const febCells = matrix.filter((c) => c.year === 2026 && c.month === 1)
    expect(febCells).toHaveLength(28)
  })
})
