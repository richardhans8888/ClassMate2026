import { FORUM_CATEGORIES } from '@/lib/constants/forum'

describe('FORUM_CATEGORIES constants', () => {
  it('exports FORUM_CATEGORIES as a constant array', () => {
    expect(Array.isArray(FORUM_CATEGORIES)).toBe(true)
  })

  it('includes "all" as the first category for filtering', () => {
    const allCategory = FORUM_CATEGORIES.find((cat) => cat.value === 'all')
    expect(allCategory).toBeDefined()
    expect(allCategory?.label).toBe('All Topics')
  })

  it('includes valid academic subject categories', () => {
    const validCategories = ['math', 'cs', 'physics', 'chemistry', 'biology']
    validCategories.forEach((category) => {
      const found = FORUM_CATEGORIES.find((cat) => cat.value === category)
      expect(found).toBeDefined()
      expect(found?.value).toBe(category)
    })
  })

  it('includes humanities categories', () => {
    const humanitiesCategories = ['history', 'literature', 'languages']
    humanitiesCategories.forEach((category) => {
      const found = FORUM_CATEGORIES.find((cat) => cat.value === category)
      expect(found).toBeDefined()
      expect(found?.value).toBe(category)
    })
  })

  it('has proper labels for all categories', () => {
    FORUM_CATEGORIES.forEach((category) => {
      expect(category.label).toBeDefined()
      expect(typeof category.label).toBe('string')
      expect(category.label.length).toBeGreaterThan(0)
    })
  })

  it('does not include deprecated category values like "help", "discussion", "resource", "announcement"', () => {
    const deprecatedValues = ['help', 'discussion', 'resource', 'announcement']
    deprecatedValues.forEach((deprecated) => {
      const found = FORUM_CATEGORIES.find((cat) => cat.value === deprecated)
      expect(found).toBeUndefined()
    })
  })

  it('ensures all category values match the seed data categories', () => {
    // The seed uses these valid categories
    const seedCategories = [
      'cs',
      'math',
      'physics',
      'chemistry',
      'biology',
      'history',
      'literature',
      'languages',
    ]
    seedCategories.forEach((seedCat) => {
      const found = FORUM_CATEGORIES.find((cat) => cat.value === seedCat)
      expect(found).toBeDefined()
    })
  })

  it('each category has both value and label properties', () => {
    FORUM_CATEGORIES.forEach((category) => {
      expect(category).toHaveProperty('value')
      expect(category).toHaveProperty('label')
      expect(typeof category.value).toBe('string')
      expect(typeof category.label).toBe('string')
    })
  })

  it('all values are lowercase for consistency', () => {
    FORUM_CATEGORIES.forEach((category) => {
      expect(category.value).toBe(category.value.toLowerCase())
    })
  })

  it('does not have duplicate category values', () => {
    const values = FORUM_CATEGORIES.map((cat) => cat.value)
    const uniqueValues = new Set(values)
    expect(uniqueValues.size).toBe(values.length)
  })
})
