/**
 * ClassMate — Database Seed
 *
 * Populates the database with realistic demo data covering all major features.
 * Safe to re-run: clears existing data before inserting fresh records.
 *
 * Seeded accounts (all use password: Password123!)
 *   admin   → evan@classmate.dev   (ADMIN)
 *   tutors  → carol@classmate.dev, george@classmate.dev (TUTOR)
 *   students→ alice, bob, diana, fiona, hannah @classmate.dev (STUDENT)
 *
 * Run: npx prisma db seed
 */

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
const SEED_PASSWORD = 'Password123!'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avatarUrl(name: string): string {
  const encoded = encodeURIComponent(name.trim() || 'User')
  return `https://ui-avatars.com/api/?name=${encoded}&size=128&background=6366f1&color=fff&bold=true`
}

function daysFromNow(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.warn('🌱  Seeding ClassMate database...\n')

  const hashedPassword = await hashPassword(SEED_PASSWORD)

  // ── Clear existing data (in FK-safe order) ─────────────────────────────────
  console.warn('  Clearing existing data...')
  await prisma.flaggedContent.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.chatSession.deleteMany()
  await prisma.studyGroupMember.deleteMany()
  await prisma.studyMaterial.deleteMany()
  await prisma.studyGroup.deleteMany()
  await prisma.forumReply.deleteMany()
  await prisma.forumPost.deleteMany()
  await prisma.forumTag.deleteMany()
  await prisma.event.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()

  // ── Users ──────────────────────────────────────────────────────────────────
  console.warn('  Creating users...')
  const [alice, bob, carol, diana, evan, fiona, george, hannah, aiTutor] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@classmate.dev',
        name: 'Alice Chen',
        image: avatarUrl('Alice Chen'),
        emailVerified: true,
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@classmate.dev',
        name: 'Bob Rodriguez',
        image: avatarUrl('Bob Rodriguez'),
        emailVerified: true,
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'carol@classmate.dev',
        name: 'Carol Williams',
        image: avatarUrl('Carol Williams'),
        emailVerified: true,
        role: 'TUTOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@classmate.dev',
        name: 'Diana Martinez',
        image: avatarUrl('Diana Martinez'),
        emailVerified: true,
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'evan@classmate.dev',
        name: 'Evan Park',
        image: avatarUrl('Evan Park'),
        emailVerified: true,
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'fiona@classmate.dev',
        name: 'Fiona Lee',
        image: avatarUrl('Fiona Lee'),
        emailVerified: true,
        role: 'STUDENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'george@classmate.dev',
        name: 'George Patel',
        image: avatarUrl('George Patel'),
        emailVerified: true,
        role: 'TUTOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'hannah@classmate.dev',
        name: 'Hannah Johnson',
        image: avatarUrl('Hannah Johnson'),
        emailVerified: true,
        role: 'STUDENT',
      },
    }),
    // System user for AI tutor chat messages
    prisma.user.create({
      data: {
        email: 'ai-tutor@classmate.dev',
        name: 'AI Tutor',
        image: avatarUrl('AI Tutor'),
        emailVerified: true,
        role: 'ADMIN',
      },
    }),
  ])

  // ── User Profiles ──────────────────────────────────────────────────────────
  console.warn('  Creating user profiles...')
  await Promise.all([
    prisma.userProfile.create({
      data: {
        userId: alice.id,
        displayName: 'Alice Chen',
        avatarUrl: avatarUrl('Alice Chen'),
        bio: 'CS sophomore. Love React and building web apps. Currently levelling up my TypeScript skills.',
        university: 'Binus University',
        major: 'Computer Science',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: bob.id,
        displayName: 'Bob Rodriguez',
        avatarUrl: avatarUrl('Bob Rodriguez'),
        bio: 'First-year student passionate about algorithms and competitive programming. Python enthusiast.',
        university: 'Binus University',
        major: 'Information Systems',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: carol.id,
        displayName: 'Carol Williams',
        avatarUrl: avatarUrl('Carol Williams'),
        bio: 'Senior CS student and peer tutor. Specialising in web development and the React ecosystem.',
        university: 'Binus University',
        major: 'Computer Science',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: diana.id,
        displayName: 'Diana Martinez',
        avatarUrl: avatarUrl('Diana Martinez'),
        bio: 'Just started my CS journey! Excited to learn data structures and algorithms from scratch.',
        university: 'Binus University',
        major: 'Computer Science',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: evan.id,
        displayName: 'Evan Park',
        avatarUrl: avatarUrl('Evan Park'),
        bio: 'ClassMate platform admin. Here to help students connect and learn together.',
        university: 'Binus University',
        major: 'Computer Science',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: fiona.id,
        displayName: 'Fiona Lee',
        avatarUrl: avatarUrl('Fiona Lee'),
        bio: 'Full-stack developer in training. Big fan of TypeScript and clean architecture principles.',
        university: 'Binus University',
        major: 'Software Engineering',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: george.id,
        displayName: 'George Patel',
        avatarUrl: avatarUrl('George Patel'),
        bio: 'Database systems tutor with 2 years of experience. Passionate about PostgreSQL and query optimisation.',
        university: 'Binus University',
        major: 'Computer Science',
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: hannah.id,
        displayName: 'Hannah Johnson',
        avatarUrl: avatarUrl('Hannah Johnson'),
        bio: 'Transfer student learning programming from scratch. Grateful for the ClassMate community!',
        university: 'Binus University',
        major: 'Information Technology',
      },
    }),
  ])

  // ── Auth Accounts (Better Auth credential provider) ────────────────────────
  console.warn('  Creating auth accounts...')
  await Promise.all(
    [alice, bob, carol, diana, evan, fiona, george, hannah].map((u) =>
      prisma.account.create({
        data: { userId: u.id, accountId: u.id, providerId: 'credential', password: hashedPassword },
      })
    )
  )

  // ── Forum Tags ─────────────────────────────────────────────────────────────
  console.warn('  Creating forum tags...')
  const tagNames = [
    'react',
    'python',
    'algorithms',
    'typescript',
    'database',
    'web-development',
    'data-structures',
    'javascript',
  ]
  const tags = await Promise.all(tagNames.map((name) => prisma.forumTag.create({ data: { name } })))
  const t = Object.fromEntries(
    tags.map((tag: { id: string; name: string }) => [tag.name, tag])
  ) as Record<string, { id: string; name: string }>

  // ── Forum Posts ────────────────────────────────────────────────────────────
  console.warn('  Creating forum posts...')
  const posts = await Promise.all([
    prisma.forumPost.create({
      data: {
        userId: alice.id,
        title: 'How do I properly use useEffect with async functions?',
        content: `I keep running into issues with async functions inside useEffect. I've tried:\n\n\`\`\`js\nuseEffect(async () => {\n  const data = await fetchData();\n  setData(data);\n}, []);\n\`\`\`\n\nBut I get a warning about returning a Promise. What's the correct pattern?`,
        category: 'cs',
        upvotes: 12,
        views: 145,
        isAnswered: true,
        repliesCount: 3,
        tags: { connect: [{ id: t['react']!.id }, { id: t['javascript']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: bob.id,
        title: 'Best resources for learning Big O notation?',
        content: `I'm preparing for technical interviews and struggling to understand time complexity analysis. Can anyone recommend good resources or share how they learned Big O notation? Books, videos, or practice sites all welcome!`,
        category: 'cs',
        upvotes: 8,
        views: 98,
        isAnswered: false,
        repliesCount: 4,
        tags: { connect: [{ id: t['algorithms']!.id }, { id: t['data-structures']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: fiona.id,
        title: 'TypeScript generics — when to use them vs. `any`?',
        content: `I understand the basics of generics in TypeScript but I'm unsure when it's appropriate to use them versus just using \`any\`. Can someone explain with practical examples? I want to write more type-safe code.`,
        category: 'cs',
        upvotes: 15,
        views: 210,
        isAnswered: true,
        repliesCount: 3,
        tags: { connect: [{ id: t['typescript']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: carol.id,
        title: '[Resource] Complete React Hooks Cheat Sheet 2026',
        content: `Here's a comprehensive cheat sheet I put together for all core React hooks:\n\n- **useState** — state management in functional components\n- **useEffect** — side effects, data fetching, subscriptions\n- **useContext** — consume context values without prop drilling\n- **useReducer** — complex state logic (alternative to useState)\n- **useMemo** — memoize expensive computations\n- **useCallback** — memoize callback functions\n- **useRef** — mutable reference that doesn't trigger re-renders\n\nFeel free to bookmark and share!`,
        category: 'cs',
        upvotes: 24,
        views: 387,
        isAnswered: false,
        repliesCount: 2,
        tags: { connect: [{ id: t['react']!.id }, { id: t['javascript']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: george.id,
        title: 'Database normalisation — 1NF, 2NF, 3NF explained clearly',
        content: `Database normalisation is a critical skill but often poorly explained. Here's my concise breakdown:\n\n**1NF**: Each column contains atomic values; no repeating groups.\n**2NF**: Must be in 1NF; every non-key attribute is fully dependent on the primary key.\n**3NF**: Must be in 2NF; no transitive dependencies — non-key attributes depend only on the primary key.\n\nAsk me any questions in the replies!`,
        category: 'cs',
        upvotes: 19,
        views: 256,
        isAnswered: false,
        repliesCount: 3,
        tags: { connect: [{ id: t['database']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: diana.id,
        title: "I'm completely lost on recursion — can anyone help?",
        content: `I've been staring at recursive algorithms for a week and still don't understand them intuitively. The factorial example makes sense but when it gets more complex (like tree traversal) I lose track completely. Is there a mental model that helps?`,
        category: 'cs',
        upvotes: 6,
        views: 72,
        isAnswered: true,
        repliesCount: 4,
        tags: { connect: [{ id: t['algorithms']!.id }, { id: t['python']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: evan.id,
        title: 'ClassMate platform update — study groups, AI tutor & more',
        content: `Excited to announce the latest ClassMate features!\n\n✅ **Study Groups** — create or join private/public groups to collaborate with peers\n✅ **AI Tutor** — get instant answers to your study questions powered by AI\n✅ **Forum Summarisation** — summarise long discussion threads with one click\n✅ **Thread Recommendations** — personalised forum recommendations based on your activity\n\nFeedback and bug reports are welcome!`,
        category: 'cs',
        upvotes: 31,
        views: 512,
        isAnswered: false,
        repliesCount: 2,
        tags: { connect: [{ id: t['web-development']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: hannah.id,
        title: "What's the difference between Python lists and tuples?",
        content: `I keep seeing both lists and tuples in Python code and I'm confused about when to use which. They seem to do the same thing? Is there a practical difference beyond mutability?`,
        category: 'cs',
        upvotes: 4,
        views: 55,
        isAnswered: true,
        repliesCount: 3,
        tags: { connect: [{ id: t['python']!.id }] },
      },
    }),
  ])

  // ── Forum Replies ──────────────────────────────────────────────────────────
  console.warn('  Creating forum replies...')
  const replies = await Promise.all([
    // Post 0: useEffect async
    prisma.forumReply.create({
      data: {
        postId: posts[0].id,
        userId: carol.id,
        content:
          'You need to define the async function *inside* the effect and call it:\n\n```js\nuseEffect(() => {\n  const load = async () => {\n    const data = await fetchData();\n    setData(data);\n  };\n  load();\n}, []);\n```\n\nThis avoids the cleanup warning because the outer callback is synchronous.',
        upvotes: 8,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[0].id,
        userId: fiona.id,
        content:
          'You can also use an IIFE for a more compact style:\n\n```js\nuseEffect(() => {\n  (async () => {\n    const data = await fetchData();\n    setData(data);\n  })();\n}, []);\n```',
        upvotes: 4,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[0].id,
        userId: george.id,
        content:
          "Also worth noting: add cleanup via AbortController if the component might unmount before the fetch completes — this prevents the 'state update on unmounted component' warning.",
        upvotes: 6,
        isAccepted: false,
      },
    }),

    // Post 1: Big O resources
    prisma.forumReply.create({
      data: {
        postId: posts[1].id,
        userId: carol.id,
        content:
          'Big-O Cheat Sheet (bigocheatsheet.com) is excellent for a quick reference. Combine it with LeetCode Easy problems — focus on understanding time/space complexity for each solution, not just getting it to pass.',
        upvotes: 7,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[1].id,
        userId: george.id,
        content:
          'Visualgo.net has amazing animations for how different algorithms scale. Sometimes seeing it visually clicks better than reading about it.',
        upvotes: 5,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[1].id,
        userId: evan.id,
        content:
          "CS50 on edX covers Big O really well in its early lectures. It's free and the explanations are very beginner-friendly.",
        upvotes: 3,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[1].id,
        userId: alice.id,
        content:
          "One mental model that helped me: ask 'if I double the input size, how does the runtime change?' That maps directly to O(n), O(n²), O(log n), etc.",
        upvotes: 9,
        isAccepted: false,
      },
    }),

    // Post 2: TypeScript generics
    prisma.forumReply.create({
      data: {
        postId: posts[2].id,
        userId: fiona.id,
        content:
          'Use generics when you want type safety without sacrificing reusability:\n\n```typescript\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n// Works with string[], number[], any array — fully type-safe\n```\n\nNever use `any` in production — use `unknown` and narrow the type instead.',
        upvotes: 11,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[2].id,
        userId: carol.id,
        content:
          "`any` is a code smell in TypeScript. The only acceptable exception is in test mocks where you genuinely don't care about types. For production code: generics > `any`, always.",
        upvotes: 7,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[2].id,
        userId: alice.id,
        content:
          "Practical rule: if you find yourself writing the same function 3+ times with different type annotations, that's your signal to reach for generics.",
        upvotes: 5,
        isAccepted: false,
      },
    }),

    // Post 3: React Hooks Cheat Sheet
    prisma.forumReply.create({
      data: {
        postId: posts[3].id,
        userId: alice.id,
        content:
          'This is gold, thank you Carol! Would you consider adding useRef and useImperativeHandle? Those trip me up sometimes.',
        upvotes: 3,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[3].id,
        userId: diana.id,
        content:
          'Saving this immediately! As a beginner this is incredibly helpful to have all in one place.',
        upvotes: 2,
        isAccepted: false,
      },
    }),

    // Post 4: Database normalisation
    prisma.forumReply.create({
      data: {
        postId: posts[4].id,
        userId: alice.id,
        content:
          "Really clear explanation! Quick question: is it always worth normalising to 3NF? I've heard sometimes denormalisation is done for performance?",
        upvotes: 4,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[4].id,
        userId: george.id,
        content:
          'Great question Alice! In high-read scenarios like analytics dashboards, controlled denormalisation (star/snowflake schemas) is common to avoid expensive JOINs. But always start normalised and denormalise intentionally with measurements.',
        upvotes: 6,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[4].id,
        userId: evan.id,
        content:
          'Worth mentioning BCNF (Boyce-Codd Normal Form) — a stronger form of 3NF. Most real-world designs target 3NF as the practical sweet spot.',
        upvotes: 2,
        isAccepted: false,
      },
    }),

    // Post 5: Recursion
    prisma.forumReply.create({
      data: {
        postId: posts[5].id,
        userId: carol.id,
        content:
          "Mental model: think of recursion as 'trust the function to work for smaller inputs.' Write the base case first (when does it stop?), then the recursive step (how does this problem relate to a slightly smaller version of itself?).",
        upvotes: 8,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[5].id,
        userId: bob.id,
        content:
          'Draw the call stack on paper! For factorial(3): it calls factorial(2), which calls factorial(1), which returns 1. Then it unwinds: 1×2=2, 2×3=6. Seeing the stack visually was a breakthrough for me.',
        upvotes: 5,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[5].id,
        userId: george.id,
        content:
          'Python Tutor (pythontutor.com) lets you step through recursive code visually. Highly recommended for visual learners.',
        upvotes: 3,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[5].id,
        userId: fiona.id,
        content:
          'Once recursion clicks, try implementing a binary search tree — it makes inorder/preorder/postorder traversal feel natural.',
        upvotes: 4,
        isAccepted: false,
      },
    }),

    // Post 6: Platform update
    prisma.forumReply.create({
      data: {
        postId: posts[6].id,
        userId: carol.id,
        content:
          'The AI Tutor feature is amazing! It helped me debug a tricky React issue in minutes. Keep up the great work!',
        upvotes: 5,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[6].id,
        userId: alice.id,
        content:
          "The forum recommendations are surprisingly accurate — it surfaced a TypeScript thread I'd been meaning to read.",
        upvotes: 3,
        isAccepted: false,
      },
    }),

    // Post 7: Python lists vs tuples
    prisma.forumReply.create({
      data: {
        postId: posts[7].id,
        userId: bob.id,
        content:
          "Key difference: **lists are mutable** (you can change elements after creation), **tuples are immutable** (you can't). Use tuples for fixed data like coordinates `(x, y)` or RGB `(255, 0, 128)`. Use lists when you need to add or remove items.",
        upvotes: 6,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[7].id,
        userId: fiona.id,
        content:
          "Practical tip: tuples are slightly faster and use less memory than lists. Also, tuples can be used as dictionary keys (they're hashable); lists cannot.",
        upvotes: 4,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[7].id,
        userId: carol.id,
        content:
          'Named tuples from `collections.namedtuple` are a great middle ground — immutable like tuples but with named fields for readability. Worth looking up!',
        upvotes: 3,
        isAccepted: false,
      },
    }),
  ])

  // ── Study Groups ───────────────────────────────────────────────────────────
  console.warn('  Creating study groups...')
  const [groupReact, groupAlgo, groupDB] = await Promise.all([
    prisma.studyGroup.create({
      data: {
        ownerId: carol.id,
        name: 'React Fundamentals',
        description:
          'A group for students learning React and modern front-end development. We hold weekly code reviews and share resources.',
        subject: 'Web Development',
        maxMembers: 10,
        memberCount: 4,
        inviteCode: 'REACT26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: george.id,
        name: 'Algorithm Prep',
        description:
          'Focused on data structures and algorithms for technical interviews. We solve LeetCode problems together twice a week.',
        subject: 'Algorithms',
        maxMembers: 8,
        memberCount: 3,
        inviteCode: 'ALGO26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: evan.id,
        name: 'Database Design',
        description:
          'Covering SQL, normalisation, query optimisation, and PostgreSQL best practices. Open to all levels.',
        subject: 'Database',
        maxMembers: 12,
        memberCount: 5,
        inviteCode: 'DB26',
      },
    }),
  ])

  // ── Study Group Members ────────────────────────────────────────────────────
  console.warn('  Adding study group members...')
  await Promise.all([
    // React group: carol (owner) + alice, fiona, diana
    prisma.studyGroupMember.create({
      data: { groupId: groupReact.id, userId: carol.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupReact.id, userId: alice.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupReact.id, userId: fiona.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupReact.id, userId: diana.id, role: 'member' },
    }),
    // Algorithm group: george (owner) + bob, fiona
    prisma.studyGroupMember.create({
      data: { groupId: groupAlgo.id, userId: george.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupAlgo.id, userId: bob.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupAlgo.id, userId: fiona.id, role: 'member' },
    }),
    // Database group: evan (owner) + george, alice, bob, hannah
    prisma.studyGroupMember.create({
      data: { groupId: groupDB.id, userId: evan.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupDB.id, userId: george.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupDB.id, userId: alice.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupDB.id, userId: bob.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupDB.id, userId: hannah.id, role: 'member' },
    }),
  ])

  // ── Study Materials ────────────────────────────────────────────────────────
  console.warn('  Creating study materials...')
  const materials = await Promise.all([
    prisma.studyMaterial.create({
      data: {
        userId: carol.id,
        title: 'React Hooks Complete Guide 2026',
        description:
          'A comprehensive PDF covering all React hooks with practical examples, common pitfalls, and patterns.',
        fileUrl: 'https://storage.classmate.dev/materials/react-hooks-guide-2026.pdf',
        subject: 'Web Development',
        fileType: 'pdf',
        downloads: 87,
        rating: 4.8,
        reviewCount: 22,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: george.id,
        title: 'SQL Query Optimisation Techniques',
        description:
          'Learn how to write efficient SQL queries, use EXPLAIN ANALYZE, and optimise indexes in PostgreSQL.',
        fileUrl: 'https://storage.classmate.dev/materials/sql-optimisation.pdf',
        subject: 'Database',
        fileType: 'pdf',
        downloads: 64,
        rating: 4.6,
        reviewCount: 17,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: evan.id,
        title: 'Big O Notation & Complexity Analysis',
        description:
          'Visual cheat sheet covering time and space complexity for common algorithms and data structures.',
        fileUrl: 'https://storage.classmate.dev/materials/big-o-cheatsheet.pdf',
        subject: 'Algorithms',
        fileType: 'pdf',
        downloads: 112,
        rating: 4.9,
        reviewCount: 34,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: alice.id,
        title: 'TypeScript Advanced Types Explained',
        description:
          'Deep dive into generics, conditional types, mapped types, and utility types with real-world examples.',
        fileUrl: 'https://storage.classmate.dev/materials/typescript-advanced-types.pdf',
        subject: 'TypeScript',
        fileType: 'pdf',
        downloads: 49,
        rating: 4.5,
        reviewCount: 12,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: fiona.id,
        title: 'Python Data Structures Workbook',
        description:
          'Practice problems and solutions for lists, stacks, queues, trees, and graphs implemented in Python.',
        fileUrl: 'https://storage.classmate.dev/materials/python-ds-workbook.pdf',
        subject: 'Data Structures',
        fileType: 'pdf',
        downloads: 73,
        rating: 4.4,
        reviewCount: 19,
      },
    }),
  ])

  // ── Chat Sessions & AI Tutor Messages ─────────────────────────────────────
  console.warn('  Creating AI tutor chat sessions...')
  const [sessionReact, sessionDB] = await Promise.all([
    prisma.chatSession.create({
      data: { userId: alice.id, title: 'React useEffect Questions', subject: 'React' },
    }),
    prisma.chatSession.create({
      data: { userId: bob.id, title: 'Database Indexing Help', subject: 'Database' },
    }),
  ])

  await Promise.all([
    // Alice's React session
    prisma.chatMessage.create({
      data: {
        senderId: alice.id,
        recipientId: aiTutor.id,
        sessionId: sessionReact.id,
        content:
          "Why does my React component re-render so many times? I'm updating state in a loop.",
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: alice.id,
        sessionId: sessionReact.id,
        content:
          'This usually happens when state updates trigger the component to re-render, which then triggers more state updates. A few things to check:\n\n1. **Are you updating state inside useEffect without proper dependencies?** An empty dependency array `[]` runs once; without it, it runs on every render.\n2. **Are you creating new objects/arrays inline in JSX?** These create new references on every render and can cause child components to re-render unnecessarily.\n3. **Use React DevTools Profiler** to identify which state change is triggering the re-render chain.',
        role: 'assistant',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: alice.id,
        recipientId: aiTutor.id,
        sessionId: sessionReact.id,
        content:
          'That makes sense! I think I was missing the dependency array. What should I put in it?',
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: alice.id,
        sessionId: sessionReact.id,
        content:
          "The dependency array should include every value from the component scope that the effect reads. A good rule of thumb:\n\n- Include all state variables and props the effect uses\n- Include all functions called inside the effect (or define them inside the effect)\n- If the effect should only run once on mount, use `[]`\n\nThe ESLint plugin `eslint-plugin-react-hooks` will warn you if you're missing dependencies — I'd recommend installing it.",
        role: 'assistant',
        isRead: true,
      },
    }),

    // Bob's Database session
    prisma.chatMessage.create({
      data: {
        senderId: bob.id,
        recipientId: aiTutor.id,
        sessionId: sessionDB.id,
        content: 'What is a database index and when should I add one?',
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: bob.id,
        sessionId: sessionDB.id,
        content:
          'A database index is a data structure (usually a B-tree) that improves the speed of data retrieval at the cost of additional storage and slower writes.\n\n**When to add an index:**\n- Columns frequently used in `WHERE` clauses\n- Columns used in `JOIN` conditions\n- Columns used in `ORDER BY` or `GROUP BY`\n- Foreign key columns\n\n**When NOT to add an index:**\n- Small tables (full scan is faster)\n- Columns with low cardinality (e.g. a boolean column)\n- Tables with very frequent INSERT/UPDATE/DELETE operations\n\nUse `EXPLAIN ANALYZE` in PostgreSQL to see if your queries are using indexes.',
        role: 'assistant',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: bob.id,
        recipientId: aiTutor.id,
        sessionId: sessionDB.id,
        content: 'How do I create an index in PostgreSQL?',
        role: 'user',
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: bob.id,
        sessionId: sessionDB.id,
        content:
          '```sql\n-- Basic index on a single column\nCREATE INDEX idx_users_email ON users(email);\n\n-- Unique index (also enforces uniqueness)\nCREATE UNIQUE INDEX idx_users_email_unique ON users(email);\n\n-- Composite index (order matters — put the most selective column first)\nCREATE INDEX idx_posts_user_created ON forum_posts(user_id, created_at);\n\n-- Partial index (only index rows that match a condition)\nCREATE INDEX idx_posts_published ON forum_posts(created_at) WHERE is_deleted = false;\n```\n\nAlways test with `EXPLAIN ANALYZE` before and after to confirm the index is being used.',
        role: 'assistant',
        isRead: false,
      },
    }),
  ])

  // ── Direct Messages ────────────────────────────────────────────────────────
  console.warn('  Creating direct messages...')
  await Promise.all([
    prisma.chatMessage.create({
      data: {
        senderId: alice.id,
        recipientId: carol.id,
        content:
          "Hey Carol! Could you take a look at my React project? I'm having trouble with context and prop drilling.",
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: carol.id,
        recipientId: alice.id,
        content:
          "Sure! Share the repo link and I'll have a look. Generally if you're more than 2-3 levels deep, Context API is the right call.",
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: alice.id,
        recipientId: carol.id,
        content:
          "https://github.com/alice/my-react-app — thanks so much! It's the UserDashboard component that's the main issue.",
        role: 'user',
        isRead: false,
      },
    }),

    prisma.chatMessage.create({
      data: {
        senderId: bob.id,
        recipientId: fiona.id,
        content: 'Hey Fiona, are you coming to the Algorithm Prep group session tonight?',
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: fiona.id,
        recipientId: bob.id,
        content: "Yes! 7pm right? I've been working on the binary tree problems from last week.",
        role: 'user',
        isRead: true,
      },
    }),

    prisma.chatMessage.create({
      data: {
        senderId: diana.id,
        recipientId: george.id,
        content:
          'Hi George, I read your normalisation post and it was really helpful! Do you offer tutoring sessions?',
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: george.id,
        recipientId: diana.id,
        content:
          'Hi Diana! Yes I do — check my tutor profile for availability. Happy to help with database concepts!',
        role: 'user',
        isRead: true,
      },
    }),
  ])

  // ── Study Group Messages ───────────────────────────────────────────────────
  console.warn('  Creating study group messages...')
  await Promise.all([
    // React group chat
    prisma.chatMessage.create({
      data: {
        senderId: carol.id,
        recipientId: carol.id,
        content:
          "Welcome everyone! This week we're covering custom hooks. Please read the React docs section on hooks before our session.",
        role: 'user',
        messageType: `group:${groupReact.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: alice.id,
        recipientId: alice.id,
        content: 'Done! I had a question about useCallback vs useMemo — can we cover that too?',
        role: 'user',
        messageType: `group:${groupReact.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: fiona.id,
        recipientId: fiona.id,
        content:
          'Same question as Alice! Also, can someone share the Codesandbox link from last week?',
        role: 'user',
        messageType: `group:${groupReact.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: carol.id,
        recipientId: carol.id,
        content:
          "Great questions! Yes, we'll cover useCallback vs useMemo. Here's last week's sandbox: https://codesandbox.io/s/hooks-demo-2026",
        role: 'user',
        messageType: `group:${groupReact.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: diana.id,
        recipientId: diana.id,
        content:
          'Thanks Carol! Should we also bring our current projects? I have a component with serious re-render issues.',
        role: 'user',
        messageType: `group:${groupReact.id}`,
        isRead: false,
      },
    }),

    // Algorithm group chat
    prisma.chatMessage.create({
      data: {
        senderId: george.id,
        recipientId: george.id,
        content:
          "Tonight's problems: binary tree level-order traversal (BFS) and longest common subsequence. Medium difficulty both.",
        role: 'user',
        messageType: `group:${groupAlgo.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: bob.id,
        recipientId: bob.id,
        content:
          'I managed BFS but DP is still tricky for me. Will we walk through the recurrence relation?',
        role: 'user',
        messageType: `group:${groupAlgo.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: fiona.id,
        recipientId: fiona.id,
        content:
          'Same — DP is my weak spot. George do you have a template you use for these problems?',
        role: 'user',
        messageType: `group:${groupAlgo.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: george.id,
        recipientId: george.id,
        content:
          "Yes! I'll share my DP problem-solving template at the start of the session. See you all at 6pm!",
        role: 'user',
        messageType: `group:${groupAlgo.id}`,
        isRead: false,
      },
    }),

    // Database group chat
    prisma.chatMessage.create({
      data: {
        senderId: evan.id,
        recipientId: evan.id,
        content:
          'Reminder: bring your schema designs for review this Thursday. No judgement — the messier the better for learning!',
        role: 'user',
        messageType: `group:${groupDB.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: george.id,
        recipientId: george.id,
        content:
          "I'll bring the normalisation exercise I've been working on. It's a nightmare right now — lots of redundancy.",
        role: 'user',
        messageType: `group:${groupDB.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: alice.id,
        recipientId: alice.id,
        content:
          "Mine too! I have a many-to-many relationship I can't figure out how to model cleanly.",
        role: 'user',
        messageType: `group:${groupDB.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: hannah.id,
        recipientId: hannah.id,
        content: 'Quick question — is 3NF always the goal or sometimes 2NF is fine?',
        role: 'user',
        messageType: `group:${groupDB.id}`,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: evan.id,
        recipientId: evan.id,
        content:
          "Great question Hannah! Short answer: OLTP systems aim for 3NF, analytical/read-heavy systems sometimes denormalise intentionally. We'll cover this Thursday.",
        role: 'user',
        messageType: `group:${groupDB.id}`,
        isRead: false,
      },
    }),
  ])

  // ── Events ─────────────────────────────────────────────────────────────────
  console.warn('  Creating events...')
  await Promise.all([
    prisma.event.create({
      data: {
        userId: carol.id,
        title: 'React Study Group — Weekly Session',
        description: 'This week we cover custom hooks and the Context API. Bring your questions!',
        date: daysFromNow(2),
        startTime: '14:00',
        endTime: '15:30',
        category: 'Study Group',
      },
    }),
    prisma.event.create({
      data: {
        userId: george.id,
        title: 'Algorithm Prep — LeetCode Session',
        description:
          'Trees and graphs focus. We will solve 3 problems together and discuss optimal solutions.',
        date: daysFromNow(4),
        startTime: '18:00',
        endTime: '19:30',
        category: 'Study Group',
      },
    }),
    prisma.event.create({
      data: {
        userId: evan.id,
        title: 'Database Design — Schema Review',
        description:
          'Bring your current schema design for group review and feedback. All DB topics welcome.',
        date: daysFromNow(3),
        startTime: '19:00',
        endTime: '20:00',
        category: 'Study Group',
      },
    }),
    prisma.event.create({
      data: {
        userId: george.id,
        title: 'Tutoring: SQL & Query Optimisation',
        description:
          '1-on-1 and small group tutoring session. Topics: EXPLAIN ANALYZE, indexing strategies, query rewrites.',
        date: daysFromNow(5),
        startTime: '16:00',
        endTime: '17:00',
        category: 'Tutoring',
      },
    }),
    prisma.event.create({
      data: {
        userId: alice.id,
        title: 'TypeScript Workshop — Advanced Types',
        description:
          'Workshop covering generics, conditional types, and mapped types. Intermediate level.',
        date: daysFromNow(7),
        startTime: '13:00',
        endTime: '14:30',
        category: 'Workshop',
      },
    }),
  ])

  // ── REMOVED: Point Transactions (gamification removed) ──────────────────────

  // ── Flagged Content (moderation demo) ─────────────────────────────────────
  console.warn('  Creating flagged content examples...')
  await Promise.all([
    prisma.flaggedContent.create({
      data: {
        reporterId: hannah.id,
        contentType: 'ForumPost',
        contentId: posts[1].id,
        reason:
          'Possible spam — post contains multiple promotional links to external tutoring services.',
        status: 'pending',
      },
    }),
    prisma.flaggedContent.create({
      data: {
        reporterId: diana.id,
        contentType: 'ForumReply',
        contentId: replies[4].id,
        reason: 'Reply contains offensive language towards the original poster.',
        status: 'resolved',
        resolvedBy: evan.id,
        resolution: 'Content reviewed — no policy violation found. Reporter notified.',
        resolvedAt: new Date(),
      },
    }),
  ])

  // ── Summary ────────────────────────────────────────────────────────────────
  console.warn('\n✅  Seed complete!\n')
  console.warn('  Seeded:')
  console.warn(`    ${9} users (1 admin, 2 tutors, 5 students, 1 AI system)`)
  console.warn(`    ${8} user profiles`)
  console.warn(`    ${8} auth accounts`)
  console.warn(`    ${tagNames.length} forum tags`)
  console.warn(`    ${posts.length} forum posts`)
  console.warn(`    ${replies.length} forum replies`)
  console.warn(`    3 study groups + members`)
  console.warn(`    ${materials.length} study materials`)
  console.warn(`    2 AI tutor chat sessions + messages`)
  console.warn(`    7 direct messages`)
  console.warn(`    14 study group messages (React/Algo/DB groups)`)
  console.warn(`    5 events`)
  console.warn(`    36 point transactions`)
  console.warn(`    2 flagged content records`)
  console.warn('\n  Login credentials (all accounts use password: Password123!)')
  console.warn('    admin  → evan@classmate.dev')
  console.warn('    tutor  → carol@classmate.dev or george@classmate.dev')
  console.warn('    student→ alice@classmate.dev or bob@classmate.dev')
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
