# 12–15. Contributions, AI Disclosure & Declaration

[← Back to README](../../README.md)

---

## 12. GitHub Contribution Summary (INDIVIDUAL)

Each student must list **their own contribution**. Contributions must match GitHub commit history.

---

**Student Name:** Kenny Tang

- Features implemented:
- API endpoints handled:
- Tests written:
- Security work:
- AI-related work:

---

**Student Name:** Richard Hans

- Features implemented:
- API endpoints handled:
- Tests written:
- Security work:
- AI-related work:

---

**Student Name:** Stefan Luciano Kencana

- Features implemented:
- API endpoints handled:
- Tests written:
- Security work:
- AI-related work:

---

## 13. AI Usage Disclosure (MANDATORY)

**AI tools used:**

- Github Copilot — used to assist with code suggestions, debugging, refactoring, and documentation generation

**Purpose of usage:**

- Development support: code suggestions, debugging assistance, explaining error messages
- Documentation: generating initial structure for README and API docs
- AI feature development: brainstorming test scenarios for the Groq integration

**Which parts were assisted:**

- Initial API route structure was suggested by Github Copilot and reviewed/modified by the team
- Test scenario generation for AI testing was assisted by Github Copilot; all test logic was written and verified by team members
- All generated code was reviewed, modified, and understood by the team before being committed

---

## 14. Known Limitations & Future Improvements

### Current Limitations

- **Real-time messaging:** Direct messages and study group chat use polling (5-second intervals) rather than WebSocket/SSE. This means there is a small delay between send and receive.
- **File storage:** In development, files are stored in `public/uploads/` which is not persistent across Docker container restarts. Production should use Firebase Storage or S3.
- **AI Tutor context:** Each AI Tutor session maintains context within the session but does not share context across sessions. Long sessions may hit Groq token limits.
- **Pagination:** Some listing views (forums, materials, groups) currently load all records. Page-based navigation is planned.
- **Search:** Full-text search is basic (`contains` query); a proper search index (e.g., Elasticsearch or pg_tsvector) would improve results at scale.

### Possible Future Enhancements

- WebSocket-based real-time messaging (replace polling)
- Push notifications (PWA / Web Push API)
- AI-generated study summaries and flashcards
- Peer review and essay grading features
- Mobile app (React Native)
- Advanced analytics dashboard for admins

### AI Limitations and Risks

- The Groq Llama 3.3-70B model may occasionally produce inaccurate academic information ("hallucinations"). Users are advised to verify AI Tutor responses against authoritative sources.
- Content moderation AI may produce false positives (blocking valid content) or false negatives (allowing borderline content). Manual moderation by MODERATOR-role users supplements AI moderation.
- Prompt injection remains a theoretical risk; system prompt enforcement and input sanitization mitigate but do not eliminate this risk.

---

## 15. Final Declaration

We declare that:

- This project is our own work
- AI usage is disclosed honestly (see Section 13)
- All group members understand the system and can explain any part during presentation

**Signed by Group Members:**

| Name                   | Signature            |
| :--------------------- | :------------------- |
| Kenny Tang             | ********\_\_******** |
| Richard Hans           | ********\_\_******** |
| Stefan Luciano Kencana | ********\_\_******** |
