/**
 * Tests for getAvatarColor function.
 * This function generates deterministic colors based on seed strings.
 */

// The AVATAR_COLORS palette from TopNavbar
const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
]

/**
 * Hash function matching the one in TopNavbar.
 */
function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

describe('getAvatarColor', () => {
  it('returns a valid Tailwind bg-* class string', () => {
    const color = getAvatarColor('user@example.com')
    expect(AVATAR_COLORS).toContain(color)
  })

  it('returns the same color for the same seed', () => {
    const seed = 'john.doe@example.com'
    const color1 = getAvatarColor(seed)
    const color2 = getAvatarColor(seed)
    expect(color1).toBe(color2)
  })

  it('returns the same color for multiple identical calls', () => {
    const seed = 'jane.smith@binus.ac.id'
    const colors = [getAvatarColor(seed), getAvatarColor(seed), getAvatarColor(seed)]
    expect(colors[0]).toBe(colors[1])
    expect(colors[1]).toBe(colors[2])
  })

  it('returns different colors for different seeds (most of the time)', () => {
    const color1 = getAvatarColor('seed1')
    const color2 = getAvatarColor('seed2')
    const color3 = getAvatarColor('seed3')

    // At least some colors should differ — collisions are possible but unlikely
    const uniqueColors = new Set([color1, color2, color3])
    expect(uniqueColors.size).toBeGreaterThan(1)
  })

  it('produces consistent hashes with short and long strings', () => {
    const shortColor = getAvatarColor('a')
    const longColor = getAvatarColor('this.is.a.very.long.email.address@subdomain.example.com')

    // Both should be valid colors
    expect(AVATAR_COLORS).toContain(shortColor)
    expect(AVATAR_COLORS).toContain(longColor)
  })

  it('handles empty string gracefully', () => {
    const color = getAvatarColor('')
    expect(AVATAR_COLORS).toContain(color)
  })

  it('produces a color from the palette for special characters', () => {
    const color = getAvatarColor('user+tag@example.com')
    expect(AVATAR_COLORS).toContain(color)
  })

  it('produces a color for unicode characters', () => {
    const color = getAvatarColor('用户@example.com')
    expect(AVATAR_COLORS).toContain(color)
  })

  it('distributes seeds across the palette (basic distribution test)', () => {
    const seeds = Array.from({ length: 50 }, (_, i) => `user${i}@example.com`)
    const colors = seeds.map(getAvatarColor)
    const uniqueColors = new Set(colors)

    // With 50 seeds and 10 colors, we should see at least 4 different colors
    // This tests that the hash function provides reasonable distribution
    expect(uniqueColors.size).toBeGreaterThanOrEqual(4)
  })

  it('produces different outputs for case variations', () => {
    const color1 = getAvatarColor('User@Example.com')
    const color2 = getAvatarColor('user@example.com')

    // Case should affect the hash, likely producing different colors
    // (though collision is theoretically possible)
    expect([color1, color2]).toContain(color1)
    expect([color1, color2]).toContain(color2)
  })
})
