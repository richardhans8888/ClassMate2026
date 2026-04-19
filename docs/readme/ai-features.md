# 8. AI Features

[← Back to README](../../README.md)

---

## 8.1 AI Feature List

| AI Feature                | Purpose                                                     | AI Type                 |
| :------------------------ | :---------------------------------------------------------- | :---------------------- |
| AI Tutor (Chat Assistant) | On-demand academic Q&A chatbot for students                 | NLP / Conversational AI |
| AI Content Moderation     | Automatic screening of every forum post/reply before saving | NLP / Classification    |
| AI Thread Summarization   | Summarize long forum threads into key points                | NLP / Summarization     |
| AI Thread Recommendations | Personalize thread feed based on user activity              | Recommendation system   |

---

## 8.2 AI Integration Flow

### AI Tutor

```
User types message in chat UI
  → POST /api/chat  (auth required)
  → lib/moderation.ts: screen message for abuse
  → Groq API: stream Llama 3.3-70B response
  → Chunked HTTP response streamed back to client
  → ChatMessage records saved (user + assistant turns)
  → ChatSession updated
```

**Failure handling:** If Groq is unavailable, the endpoint returns `503 AI service temporarily unavailable`. The UI displays a user-friendly error and disables the send button until retry.

### AI Content Moderation

```
User submits forum post/reply
  → POST /api/forums/posts (or /replies)
  → lib/moderation.ts called BEFORE any DB write
  → Groq API: classify content (safe / violation)
  → If VIOLATION → return 403 "Content violates community guidelines"
  → If Groq ERROR → fail-closed: return 503 (content blocked)
  → If SAFE → proceed to save to PostgreSQL
```

**Failure handling:** Fail-closed design — if the Groq call errors for any reason, the content is blocked. This prevents guideline violations from slipping through during AI outages.

### AI Thread Summarization

```
User clicks "Summarize" on a forum post
  → POST /api/summarize  (auth required)
  → Groq API: generate summary of post + top replies
  → Return summary JSON to client
  → Displayed in a collapsible card above replies
```

**Failure handling:** If Groq is unavailable, a toast error is shown and the summary card is hidden.

### AI Thread Recommendations

```
User visits /dashboard or /forums/discover
  → GET /api/recommendations/threads  (auth required)
  → lib/recommendations.ts: score threads by category overlap,
    upvote weight, recency, and user history
  → Return ranked list of thread IDs
  → Fetch thread details and render
```

This is a scoring-based recommendation system — not a live AI call — so it has no Groq dependency and cannot fail due to AI unavailability.

---

> AI testing is documented in [Testing §10.4](testing.md#104-ai-functionality-testing).
