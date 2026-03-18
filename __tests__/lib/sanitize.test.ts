import { containsXSSPatterns, sanitizeMarkdown, sanitizeText, sanitizeUrl } from '@/lib/sanitize'

describe('sanitizeText', () => {
  it('removes script tags', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('')
  })

  it('removes all HTML tags', () => {
    expect(sanitizeText('<div><b>bold</b></div>')).toBe('bold')
  })

  it('removes onclick handlers', () => {
    expect(sanitizeText('<div onclick="alert(1)">text</div>')).toBe('text')
  })

  it('handles null/undefined', () => {
    expect(sanitizeText(null)).toBe('')
    expect(sanitizeText(undefined)).toBe('')
  })

  it('preserves normal text', () => {
    expect(sanitizeText('Hello, World!')).toBe('Hello, World!')
  })
})

describe('sanitizeMarkdown', () => {
  it('preserves safe tags', () => {
    expect(sanitizeMarkdown('<b>bold</b>')).toContain('bold')
    expect(sanitizeMarkdown('<em>italic</em>')).toContain('italic')
  })

  it('removes dangerous tags', () => {
    expect(sanitizeMarkdown('<script>evil()</script>')).not.toContain('script')
    expect(sanitizeMarkdown('<iframe src="evil.com"></iframe>')).not.toContain('iframe')
  })

  it('removes javascript URLs', () => {
    const result = sanitizeMarkdown('<a href="javascript:alert(1)">link</a>')
    expect(result).not.toContain('javascript:')
  })

  it('removes event handlers', () => {
    expect(sanitizeMarkdown('<div onmouseover="evil()">text</div>')).not.toContain('onmouseover')
  })
})

describe('sanitizeUrl', () => {
  it('accepts valid https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
  })

  it('accepts valid http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('rejects javascript URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull()
  })

  it('rejects data URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>evil()</script>')).toBeNull()
  })

  it('handles invalid URLs', () => {
    expect(sanitizeUrl('not a url')).toBeNull()
  })
})

describe('containsXSSPatterns', () => {
  it('detects script tags', () => {
    expect(containsXSSPatterns('<script>alert(1)</script>')).toBe(true)
  })

  it('detects javascript protocol', () => {
    expect(containsXSSPatterns('javascript:void(0)')).toBe(true)
  })

  it('detects event handlers', () => {
    expect(containsXSSPatterns('<img onerror="evil()">')).toBe(true)
  })

  it('passes clean content', () => {
    expect(containsXSSPatterns('Hello, this is normal text')).toBe(false)
  })
})
