export function toISO(year: number, month: number, day: number): string {
  const d = new Date(year, month, day)
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString()
  return iso.slice(0, 10)
}

export function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startDow = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const cells = 42
  const matrix: { year: number; month: number; day: number }[] = []

  for (let i = 0; i < cells; i++) {
    const idx = i - startDow + 1
    if (idx <= 0) {
      const day = prevMonthDays + idx
      const pm = month - 1 < 0 ? 11 : month - 1
      const py = month - 1 < 0 ? year - 1 : year
      matrix.push({ year: py, month: pm, day })
    } else if (idx > daysInMonth) {
      const day = idx - daysInMonth
      const nm = month + 1 > 11 ? 0 : month + 1
      const ny = month + 1 > 11 ? year + 1 : year
      matrix.push({ year: ny, month: nm, day })
    } else {
      matrix.push({ year, month, day: idx })
    }
  }

  return matrix
}
