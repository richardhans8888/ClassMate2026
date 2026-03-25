export interface ModerationResult {
  safe: boolean
  toxicity_score: number
  spam_score: number
  categories: string[]
  action: 'approve' | 'warn' | 'block'
  reason: string
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/moderation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: '', // Note: In production, you'd pass the auth cookie for internal calls
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      return {
        safe: true,
        toxicity_score: 0,
        spam_score: 0,
        categories: [],
        action: 'approve',
        reason: 'Moderation service unavailable, defaulting to approve',
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Moderation error:', error)
    return {
      safe: true,
      toxicity_score: 0,
      spam_score: 0,
      categories: [],
      action: 'approve',
      reason: 'Moderation service error, defaulting to approve',
    }
  }
}
