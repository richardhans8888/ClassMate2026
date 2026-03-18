const ALLOWED_MARKDOWN_TAGS = new Set([
  'p',
  'b',
  'i',
  'em',
  'strong',
  'code',
  'pre',
  'ul',
  'ol',
  'li',
  'a',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'blockquote',
])

function removeDangerousBlocks(input: string): string {
  return input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<(object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
}

function stripAllTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

function sanitizeAnchorAttributes(rawAttributes: string): string {
  const hrefMatch = rawAttributes.match(/\bhref\s*=\s*(['"])(.*?)\1/i)
  const targetMatch = rawAttributes.match(/\btarget\s*=\s*(['"])(.*?)\1/i)
  const relMatch = rawAttributes.match(/\brel\s*=\s*(['"])(.*?)\1/i)

  const attributes: string[] = []
  const safeHref = sanitizeUrl(hrefMatch?.[2])
  if (safeHref) {
    attributes.push(`href="${safeHref}"`)
  }
  if (targetMatch?.[2]) {
    attributes.push(`target="${targetMatch[2]}"`)
  }
  if (relMatch?.[2]) {
    attributes.push(`rel="${relMatch[2]}"`)
  }

  return attributes.length > 0 ? ` ${attributes.join(' ')}` : ''
}

/**
 * Sanitize plain text - removes all HTML
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ''
  const withoutDangerousBlocks = removeDangerousBlocks(input)
  return stripAllTags(withoutDangerousBlocks).trim()
}

/**
 * Sanitize content that may contain markdown/basic HTML
 * Preserves safe formatting tags
 */
export function sanitizeMarkdown(input: string | null | undefined): string {
  if (!input) return ''
  const stripped = removeDangerousBlocks(input)
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"]?)\s*(javascript:|vbscript:|data:)[^\s>]*\2/gi, '')

  const cleaned = stripped.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, rawTag, rawAttributes) => {
    const tag = String(rawTag).toLowerCase()
    const isClosing = full.startsWith('</')

    if (!ALLOWED_MARKDOWN_TAGS.has(tag)) {
      return ''
    }

    if (isClosing) {
      return `</${tag}>`
    }

    if (tag === 'a') {
      return `<a${sanitizeAnchorAttributes(String(rawAttributes))}>`
    }

    return `<${tag}>`
  })

  return cleaned.trim()
}

/**
 * Sanitize URLs - validates and sanitizes URL format
 */
export function sanitizeUrl(input: string | null | undefined): string | null {
  if (!input) return null

  try {
    const url = new URL(input)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }
    return url.toString()
  } catch {
    return null
  }
}

/**
 * Check for common XSS patterns (for logging/alerting)
 */
export function containsXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onload=, etc.
    /data:/i,
    /vbscript:/i,
  ]
  return xssPatterns.some((pattern) => pattern.test(input))
}
