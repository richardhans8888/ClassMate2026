# Manual Testing Findings Report

> Last Updated: 2026-04-14
> Author: Manual QA pass (self-testing)
> Scope: User-reported issues from real usage, not automated tests

## Summary

This report replaces the previous automated/spec-oriented 05 report.

Current manually observed issues:

1. Forum upvote behavior does not persist as expected for posts and replies.
2. Study Groups page exposes three separate create-group entry points and feels inconsistent. _(folded into Issue 5 redesign scope)_
3. Chat page repeatedly requests a conversation with undefined target user and shows target-user errors.
4. Materials, Study Groups, and Forum listing flows need explicit pagination (Previous/Next) instead of unbounded list growth patterns.
5. Study Groups feature is fundamentally broken and over-engineered — requires a complete redesign.
6. Chat feature has phantom Phone/Video buttons (not in spec), a broken new-conversation button linking to a non-existent route, no user picker for starting DMs, and a hardcoded online indicator — requires cleanup and a scoped DM initiation flow.

## Environment

- App type: Next.js App Router
- Data source: Seeded data from prisma/seed.ts
- Testing style: Manual click-path and behavior observation
- Key observed server log:

```text
GET /api/messages/conversations/undefined?limit=50 404
GET /api/messages/conversations 200
(repeats every polling cycle)
```

## Issue 1: Forum Upvote Not Persisting

### User Impact

- Clicking upvote appears to happen in UI, but final state does not persist reliably after refresh/navigation.
- Same user experience for post upvote and reply upvote.

### Research Notes

Relevant files reviewed:

- UI button logic: components/features/forums/UpvoteButton.tsx
- Post detail usage: components/features/forums/ForumPostDetail.tsx
- Reply usage: components/features/forums/RepliesList.tsx
- API routes: app/api/forums/posts/[id]/upvote/route.ts and app/api/forums/replies/[id]/upvote/route.ts
- Service logic: lib/services/forum.service.ts

Observed behavior in code:

- Upvote button uses optimistic UI update first.
- If API responds non-2xx, button silently reverts local state.
- No error message/toast is shown to the user on failure.

Practical implication:

- If API returns 401/403/404/500, user only sees a quick visual toggle then rollback, which feels like upvote does not save.
- Current UX can hide the real cause (for example unauthorized session or self-upvote restriction).

Likely root-cause category:

- Persistence failure may be backend rejection, but frontend error handling is currently invisible to users.
- This needs deeper runtime validation with network response inspection in browser devtools for exact status codes per failed click.

### Reproduction (Manual)

1. Open forum thread page.
2. Click post upvote or reply upvote.
3. Observe count change then eventual rollback/no persisted change.
4. Refresh page and verify upvote state did not remain.

### Severity

- Medium-High (core interaction feature behaves unreliably from user perspective).

## Issue 3: Chat Shows Target User Not Found and Calls Undefined Conversation

### User Impact

- Chat experience appears broken due to repeated error state.
- Server logs spam with repeated 404 requests every poll cycle.

### Research Notes

Relevant files reviewed:

- Chat conversation page: app/(main)/chat/[userId]/page.tsx
- Conversations list API: app/api/messages/conversations/route.ts
- Conversation detail API: app/api/messages/conversations/[userId]/route.ts

Observed behavior in code:

- Conversation page reads `const userId = params.userId` directly in a client component.
- Polling repeatedly calls:
  - `/api/messages/conversations/${userId}?limit=50`
  - `/api/messages/conversations/${userId}/read`
- If `userId` resolves to the literal string `undefined`, detail endpoint returns 404 Target user not found.
- Polling then repeats the bad request every 5 seconds.

Why the log message matches this:

- Backend route checks target user existence and returns 404 with `Target user not found` when no user matches the route param.
- This aligns exactly with `GET /api/messages/conversations/undefined?limit=50` errors.

Likely root-cause category:

- Route-param handling mismatch on client conversation page and missing guard against invalid `userId` before polling.

### Reproduction (Manual)

1. Open chat area.
2. Observe network/server logs.
3. Repeated 404 requests are made to conversation path with `undefined` as userId.
4. Chat page surfaces target-user error states.

### Severity

- High (chat core flow disrupted and noisy error loops).

## Issue 4: Materials, Study Groups, and Forums Need Page-Based Navigation

### User Impact

- As content grows, long continuously growing lists are harder to navigate and harder to resume from a known position.
- Users need predictable navigation controls (for example: Previous, page number, Next) for browsing and returning to earlier results.

### Request Scope (Manual Product Finding)

Apply consistent page-based navigation to:

1. Materials listing
2. Study Groups listing
3. Forums listing

Expected behavior direction:

- Replace infinite/additional-scroll style growth patterns with explicit pagination controls.
- Preserve filters/search while changing pages.
- Keep page size consistent for predictable browsing.

### Why This Matters

- Better usability for larger datasets.
- Clearer URL/shareability potential when page state is explicit.
- Less UI fatigue compared with endless scrolling for study/research workflows.

### Suggested Acceptance Criteria (for future implementation)

1. Each listing page supports `page` and `limit` query params.
2. UI provides Previous and Next buttons, with disabled states at boundaries.
3. Current page indicator is visible (for example: Page 2 of 8).
4. Filters/sort/search remain applied while moving between pages.
5. Empty state is shown when page has no results.

### Severity

- Medium (scalability and usability issue that increases with content volume).

## Issue 5: Study Groups Feature is Fundamentally Broken and Must Be Rebuilt

### User Impact

- Clicking "Join Group" does not join the group — it navigates the user directly into a group chat page without making any API call.
- Pressing back does not reflect any joined state because no join ever happened.
- The group detail page renders entirely fake hardcoded data — names, members, messages, and files are all mocked in code and have nothing to do with the actual database record.
- Chat messages sent inside a group are never saved — they only update local React state and disappear on refresh.
- Users see features (voice channel references, file sidebars, Discord-style navigation) that do not exist at all in the backend.

### Research Notes

#### Finding A: Join flow is completely bypassed

File reviewed: `app/(main)/groups/page.tsx`

The "Join Group" button is rendered as a plain `<Link href={'/groups/${g.id}'}>` tag. This sends the user to the group detail page immediately without calling the join endpoint.

The join API exists and is correctly implemented at `/api/study-groups/[groupId]/join` (POST), but it is never called from the frontend. As a result:

- Non-members can freely access any group detail page.
- The `StudyGroupMember` table is never populated for join actions.
- No feedback (success toast, error) is shown to the user.

#### Finding B: Group detail page is entirely fake — zero real data

File reviewed: `app/(main)/groups/[id]/page.tsx`

The entire component is built from hardcoded mock data. There are zero API calls in this file. Key observations:

```tsx
// The group info is hardcoded — the URL param `id` is never read
const groupInfo: GroupInfo = {
  id: '404',
  name: 'Advanced Macroeconomics',
  subtitle: 'Prepare for Midterm Exam',
  membersOnline: 12,
}

// Members are hardcoded — not from the database
const members: Member[] = [
  { id: '1', name: 'Alex Johnson', role: 'Scholar', avatar: '/avatars/alex.jpg', ... },
  { id: '2', name: 'Sarah Miller', role: 'Novice', ... },
  // ... 4 more fake members
]

// Messages are hardcoded — not from the database
const initialMessages: Message[] = [
  { id: '1', sender: 'Alex Johnson', content: 'Hey everyone! ...', ... },
  // ... 3 more fake messages including one referencing a voice channel
]

// Sending a message only updates local React state — no API call
const handleSendMessage = (content: string) => {
  setMessages([...messages, newMessage]) // disappears on refresh
}
```

The route param `id` is declared in the file signature but never used. Every group in the app shows the exact same fake data regardless of which group is opened.

#### Finding C: Feature is over-engineered with redundant and fake sub-features

The group detail page includes five sub-components:

- `GroupNavSidebar` — Discord-style sidebar navigation between channels
- `GroupHeader` — search bar and hardcoded member count
- `GroupMessageFeed` — renders hardcoded messages
- `GroupComposer` — input box that only updates local React state
- `GroupMembersSidebar` — hardcoded fake member list
- `GroupFilesSidebar` — file attachments from mock messages only

Mock message content references a "voice channel":

```
"I'm hopping into the voice channel"
```

Voice channels are completely out of scope for this project. Additionally:

- Group chat duplicates the existing DM chat feature at `/chat`
- Group file sharing duplicates the existing Materials feature at `/materials`
- The spec explicitly warns: "Over-scoped projects will be penalized" and "Simplicity + correctness better than feature overload"

#### Finding D: Issue 2 (three create buttons) is a symptom of the same problem

The study groups listing page has three separate create-group triggers. This is a UX clarity issue stemming from the same over-engineered design and should be resolved as part of the redesign.

### Is Study Groups a Spec Requirement?

Yes. Domain 8 (Student Community & Collaboration Platform) lists "File sharing and collaboration spaces" as Core Functional Feature #4. Study Groups is the correct interpretation of this requirement.

However, the current implementation does not satisfy the requirement because:

- No real data is shown — the detail page is a mockup
- Joining a group does not work
- The "collaboration" features (chat, files, voice) are either fake or redundant with other features

### Redesign Plan — What Simplified Study Groups Should Look Like

The goal is a correct, minimal implementation that satisfies the spec requirement without duplicating existing features.

**Keep (rebuild correctly):**

- Group listing page: browse all groups, search/filter by subject — already works, keep as-is
- Create group: already works correctly via API — keep, remove duplicate create buttons
- Join group: must call `POST /api/study-groups/[groupId]/join`, show success/error feedback, update UI to reflect joined state
- Leave group: call DELETE equivalent or leave endpoint, update UI
- Group detail page (simplified): show real data from API — group name, description, subject, member count, members list, and whether the current user is a member
- Owner can delete group: already works at API level

**Remove (do not rebuild):**

- Group chat (users can use DM chat via `/chat` for coordination)
- Group file sidebar (users can use `/materials` for file sharing)
- Voice channel concept (out of scope entirely)
- Discord-style `GroupNavSidebar` navigation
- `GroupMembersSidebar` as a separate panel (integrate member list into main detail view instead)

**Simplified group detail page structure:**

1. Group header: name, subject tag, description, member count
2. Members section: real list from `StudyGroupMember` table via API
3. Action area: "Leave Group" if member, "Join Group" if not, "Delete Group" if owner
4. No chat, no files, no voice

**API endpoints already available (no new backend needed):**

- `GET /api/study-groups` — list groups (works)
- `POST /api/study-groups` — create group (works)
- `DELETE /api/study-groups` — delete group (works)
- `POST /api/study-groups/[groupId]/join` — join group (exists, never called from frontend)
- Need: `GET /api/study-groups/[groupId]` — get single group with members (may need to add)
- Need: `DELETE /api/study-groups/[groupId]/leave` or equivalent — leave group (may need to add)

### Reproduction (Manual)

1. Go to `/groups`.
2. Click "Join Group" on any group card.
3. Observe: you are taken directly into the group page without any join confirmation.
4. Press back.
5. Observe: you are still shown as "not joined" — no state change occurred.
6. Open any group page directly via URL (e.g. `/groups/some-real-id`).
7. Observe: you see "Advanced Macroeconomics" regardless of which group you opened.
8. Send a message in the group chat.
9. Observe: message appears in UI.
10. Refresh the page.
11. Observe: message is gone — it was never saved.

### Severity

- Critical (the feature does not function at all — it is a non-interactive mockup).

## Issue 6: Chat Feature Has Phantom UI, Broken New-Conversation Flow, and No Social Context for DMs

### User Impact

- The DM conversation header shows Phone and Video call buttons that do nothing — clicking them produces no action, no tooltip, no error. These features do not exist anywhere in the backend or spec.
- The conversation list has a "new message" edit-pencil icon (top right) that navigates to `/chat/new`. That route does not exist, so the user lands on a 404 or not-found page.
- Even if the new-conversation flow worked, there is no UI to select who to message. The user is expected to already know a userId and somehow arrive at `/chat/[userId]`. There is no user picker, no contact list, no suggestion list anywhere in the chat flow.
- Every user in the conversation list shows a green "online" indicator dot regardless of actual presence — this is hardcoded CSS and is misleading.
- The spec requires "real-time or asynchronous chat" (Domain 8, Core Feature #3). DM chat partially satisfies this, but the current implementation has no meaningful social context: anyone can DM anyone, which is disconnected from the collaboration platform concept.

### Research Notes

#### Finding A: Video and Voice call icons are phantom UI

File reviewed: `app/(main)/chat/[userId]/page.tsx`

Lines 180–188:

```tsx
<Button variant="ghost" size="icon" className="text-muted-foreground rounded-lg">
  <Phone className="h-5 w-5" />
</Button>
<Button variant="ghost" size="icon" className="text-muted-foreground rounded-lg">
  <Video className="h-5 w-5" />
</Button>
```

These buttons have no `onClick` handler, no `disabled` attribute, no `aria-label`, and no backend equivalent. Voice and video calling are completely out of scope for this project per the spec ("Over-scoped projects will be penalized"). They must be removed.

#### Finding B: New conversation button links to a non-existent route

File reviewed: `app/(main)/chat/page.tsx`

Line 122–128:

```tsx
<Link
  href="/chat/new"
  ...
>
  <Edit className="h-4 w-4" />
</Link>
```

`/chat/new` has no page file. There is no `app/(main)/chat/new/page.tsx`. Clicking this icon results in a not-found error. The entire "start a new conversation" user journey is broken.

#### Finding C: No user picker or contact model for DM initiation

There is no page, modal, or component that lets a user select who to message. The only way to open a DM thread is to already know the target user's ID and navigate directly to `/chat/[userId]`. This is not a real product experience.

Additionally, DMs are currently open to all users with no social constraint. In the context of a collaboration platform, this creates unnecessary scope — users should be able to message people they already have a shared context with.

#### Finding D: Online indicator is hardcoded

File reviewed: `app/(main)/chat/page.tsx`

Line 169:

```tsx
<div className="bg-semantic-success border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2" />
```

This green dot is unconditionally rendered for every conversation entry. There is no presence or online-status API. It incorrectly implies all users are always online.

### Redesign Plan — What Simplified Chat Should Look Like

The goal is to match the spec requirement ("asynchronous chat") while giving the feature real social context without over-engineering.

**Proposed model: DMs are scoped to shared-group members**

A user can only start a DM with someone they share at least one study group with. This is practical (students naturally communicate with groupmates), removes the need for a global user directory in the chat feature, and integrates cleanly with the simplified Study Groups redesign from Issue 5.

Think of it like WhatsApp or LINE but scoped: you see a contacts list derived from your group memberships, not all registered users.

**Remove (do not rebuild):**

- Phone call button (`<Phone>` icon in chat header)
- Video call button (`<Video>` icon in chat header)
- MoreVertical menu button (no actions wired up either)
- Hardcoded green online indicator dot
- `/chat/new` dead link and Edit pencil icon

**Keep (fix and keep):**

- Conversation list page — works correctly, polls real API, shows real conversations
- DM thread page — works correctly, sends and receives real messages via API
- Search/filter within conversation list — works correctly

**Add (new functionality):**

- "New Message" flow: opens a modal or inline panel that shows a list of users the current user shares a group with (call `GET /api/study-groups` → collect member IDs → render picker)
- Clicking a user in the picker navigates to `/chat/[userId]`, creating the thread on first message
- Remove online indicator or replace with an honest "last seen" timestamp if available

**API changes needed:**

- No new backend endpoints required — `/api/messages/conversations/[userId]` (POST) already creates a thread on first message
- Need: client-side query to fetch group members to populate the new-message picker (can combine `GET /api/study-groups` responses)

**Simplified new-message flow:**

1. User clicks "New Message" button in chat list header
2. A modal/panel opens showing all users from the current user's joined groups (deduplicated)
3. User clicks a name → navigates to `/chat/[userId]`
4. First message sent creates the conversation record

### Reproduction (Manual)

1. Open `/chat`.
2. Click the edit/pencil icon in the top right.
3. Observe: 404 or not-found page — the `/chat/new` route does not exist.
4. Navigate to an existing DM thread via `/chat/[some-userId]`.
5. Observe: Phone and Video icons appear in the header.
6. Click Phone icon.
7. Observe: nothing happens — no action, no feedback.
8. Click Video icon.
9. Observe: nothing happens — no action, no feedback.
10. Return to `/chat`.
11. Observe: all conversation entries show a green online dot regardless of user status.

### Severity

- High (new conversation flow is completely broken; phantom UI undermines credibility for demo/grading).

---

## Priority for Next Fix Pass (No code changes in this report)

1. **Study Groups complete redesign** (critical — feature is entirely fake and broken, must rebuild from scratch as simplified correct version before project submission).
2. **Chat phantom UI cleanup + new-conversation flow** (high — Phone/Video buttons are out-of-spec dead UI, new-message button leads to a 404, and there is no way to start a new DM in the app).
3. **Chat undefined userId loop** (high — broad user impact, noisy error loops; likely resolved once DM initiation flow is fixed and users always arrive with a valid userId).
4. **Forum upvote persistence/feedback diagnostics** (medium-high — core interaction behaves unreliably).
5. **Add page-based navigation for Materials, Study Groups, and Forums** (medium — scalability and navigation clarity).
6. **Study Groups create-button deduplication** (low — resolved as part of the redesign in item 1).

## Notes

- This report intentionally focuses on manual findings and code-level research only.
- No implementation changes were made in this pass.
- Additional findings can be appended in the next revision when more manual tests are completed.
- Issue 2 (three create buttons) has been folded into Issue 5 as it is part of the same underlying over-engineering problem with Study Groups.
