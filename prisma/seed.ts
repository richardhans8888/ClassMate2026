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
  await prisma.connection.deleteMany()
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
    'machine-learning',
    'security',
    'css',
    'git',
    'linux',
    'study-tips',
    'math',
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
    // ── Additional posts (page 2 demo + variety) ───────────────────────────────
    prisma.forumPost.create({
      data: {
        userId: bob.id,
        title: 'How does JWT authentication work under the hood?',
        content: `I'm implementing login for my web project and everyone says to use JWT, but I don't really understand how it works. How does the server verify the token? Where should I store it on the client — localStorage or cookies? And what makes it "stateless"?`,
        category: 'cs',
        upvotes: 18,
        views: 234,
        isAnswered: false,
        repliesCount: 0,
        tags: { connect: [{ id: t['security']!.id }, { id: t['web-development']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: diana.id,
        title: 'CSS Flexbox vs Grid — when to use which?',
        content: `I keep going back and forth between Flexbox and CSS Grid and I'm not sure I'm picking the right one. My understanding:\n- Flexbox = one-dimensional (row or column)\n- Grid = two-dimensional (rows AND columns)\n\nBut in practice they seem interchangeable a lot of the time. Can someone give me clear rules for when to reach for each?`,
        category: 'cs',
        upvotes: 11,
        views: 167,
        isAnswered: true,
        repliesCount: 0,
        tags: { connect: [{ id: t['css']!.id }, { id: t['web-development']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: fiona.id,
        title: 'Getting started with Machine Learning — best first steps?',
        content: `I want to learn Machine Learning but the field feels overwhelming. There are so many frameworks (TensorFlow, PyTorch, scikit-learn), math prerequisites (linear algebra, stats, calculus), and online courses. Where should an intermediate Python developer actually start? What's the logical learning path?`,
        category: 'cs',
        upvotes: 22,
        views: 318,
        isAnswered: false,
        repliesCount: 0,
        tags: { connect: [{ id: t['machine-learning']!.id }, { id: t['python']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: alice.id,
        title: 'Git branching strategies for small team projects',
        content: `Our team of 3 is building a web app for our final project and we keep stepping on each other with Git. We've had merge conflicts on main twice this week. What branching strategy is practical for a small team? Is Git Flow overkill for 3 people, or should we just use feature branches off main?`,
        category: 'general',
        upvotes: 9,
        views: 121,
        isAnswered: true,
        repliesCount: 0,
        tags: { connect: [{ id: t['git']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: carol.id,
        title: 'Study tips that actually worked for me in CS — share yours!',
        content: `After two years of CS I've figured out what actually works for me:\n\n1. **Active recall over passive reading** — close the notes and try to explain it from memory\n2. **Pomodoro for coding** — 25 min focus, 5 min break keeps me sharp\n3. **Rubber duck debugging** — explaining the problem out loud catches more bugs than staring at the screen\n4. **Spaced repetition** — Anki for flashcards of algorithms and patterns\n5. **Build something real** — tutorials alone don't stick; build a project using what you learned\n\nWhat are your go-to study strategies?`,
        category: 'general',
        upvotes: 27,
        views: 445,
        isAnswered: false,
        repliesCount: 0,
        tags: { connect: [{ id: t['study-tips']!.id }] },
      },
    }),
    prisma.forumPost.create({
      data: {
        userId: george.id,
        title: 'Probability & statistics resources for CS students',
        content: `Probability and stats keep coming up in my CS coursework (machine learning, algorithm analysis, networking) and my maths background is weak. Which resources do you recommend that are specifically aimed at CS applications rather than pure maths? I want intuition, not proofs.`,
        category: 'math',
        upvotes: 14,
        views: 198,
        isAnswered: false,
        repliesCount: 0,
        tags: { connect: [{ id: t['math']!.id }, { id: t['machine-learning']!.id }] },
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

    // Post 8: JWT authentication
    prisma.forumReply.create({
      data: {
        postId: posts[8].id,
        userId: carol.id,
        content:
          'JWT is a signed token with 3 base64-encoded parts: **header** (algorithm), **payload** (claims like userId, expiry), and **signature**.\n\nThe server signs it with a secret key. On each request, the server re-signs the payload and checks if it matches — no database lookup needed, hence "stateless".\n\n**Storage**: use HttpOnly cookies (not localStorage) — localStorage is vulnerable to XSS. HttpOnly cookies cannot be read by JavaScript at all.',
        upvotes: 14,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[8].id,
        userId: george.id,
        content:
          'One thing to know: JWTs cannot be invalidated before expiry unless you maintain a blocklist (which defeats the stateless benefit). For most apps, short expiry (15 min) + refresh tokens is the right pattern.',
        upvotes: 8,
        isAccepted: false,
      },
    }),

    // Post 9: CSS Flexbox vs Grid
    prisma.forumReply.create({
      data: {
        postId: posts[9].id,
        userId: fiona.id,
        content:
          "My rule of thumb:\n- **Flexbox** when you have a list of things in a row or column and you want them to flow naturally (nav links, card rows, button groups)\n- **Grid** when you're designing a page layout where items need to align across both axes simultaneously (header/sidebar/main/footer, image galleries)\n\nIf you're only thinking in one dimension, Flexbox. If you're thinking about rows AND columns at once, Grid.",
        upvotes: 13,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[9].id,
        userId: alice.id,
        content:
          'CSS Tricks has the definitive guides for both. Flexbox guide and Grid guide — I keep both bookmarked.',
        upvotes: 5,
        isAccepted: false,
      },
    }),

    // Post 10: Machine Learning
    prisma.forumReply.create({
      data: {
        postId: posts[10].id,
        userId: george.id,
        content:
          "Recommended path for a Python developer:\n1. **Statistics & linear algebra basics** — 3Blue1Brown's Essence of Linear Algebra (YouTube, free)\n2. **scikit-learn** — start here, not PyTorch. It handles the boring parts so you can focus on understanding models\n3. **Andrew Ng's ML Specialisation** (Coursera) — still the gold standard intro course\n4. **Build a project** — Kaggle competitions for practise with real datasets\n5. **Then** move to deep learning (PyTorch is now preferred over TensorFlow for new learners)\n\nDon't try to learn everything at once.",
        upvotes: 19,
        isAccepted: false,
      },
    }),

    // Post 11: Git branching
    prisma.forumReply.create({
      data: {
        postId: posts[11].id,
        userId: evan.id,
        content:
          'For 3 people, a simple **GitHub Flow** is perfect:\n1. `main` is always deployable\n2. Create a feature branch for each task: `feature/user-auth`, `fix/login-bug`\n3. Open a pull request when done, have one teammate review\n4. Merge and delete the branch\n\nGit Flow (with develop, release, hotfix branches) is overkill until you have scheduled releases and multiple parallel workstreams.',
        upvotes: 11,
        isAccepted: true,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[11].id,
        userId: carol.id,
        content:
          'Also: set branch protection on `main` so nobody can push directly — only merges via PR. It takes 30 seconds in GitHub settings and saves a lot of pain.',
        upvotes: 7,
        isAccepted: false,
      },
    }),

    // Post 12: Study tips
    prisma.forumReply.create({
      data: {
        postId: posts[12].id,
        userId: bob.id,
        content:
          "The rubber duck method is underrated. I actually keep a small rubber duck on my desk. My housemates think I'm weird but I solve more bugs talking to it than staring at the screen.",
        upvotes: 9,
        isAccepted: false,
      },
    }),
    prisma.forumReply.create({
      data: {
        postId: posts[12].id,
        userId: diana.id,
        content:
          "I use the Feynman technique: after studying something, I try to explain it in a paragraph like I'm teaching a beginner. The gaps in my explanation show exactly what I haven't actually understood yet.",
        upvotes: 12,
        isAccepted: false,
      },
    }),

    // Post 13: Probability & stats
    prisma.forumReply.create({
      data: {
        postId: posts[13].id,
        userId: carol.id,
        content:
          '"Probability for the Enthusiastic Beginner" by Morin is excellent — very intuitive, written specifically to build understanding rather than rigour. Also "Think Stats" by Allen Downey (free online) takes a code-first approach using Python, which suits CS students well.',
        upvotes: 10,
        isAccepted: false,
      },
    }),
  ])

  // ── Study Groups ───────────────────────────────────────────────────────────
  console.warn('  Creating study groups...')
  const [
    groupReact,
    groupAlgo,
    groupDB,
    groupPython,
    groupML,
    groupSecurity,
    groupTypeScript,
    groupMath,
    groupWebDev,
    groupOSS,
  ] = await Promise.all([
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
    prisma.studyGroup.create({
      data: {
        ownerId: hannah.id,
        name: 'Python Basics',
        description:
          'A beginner-friendly group for students learning Python from scratch. We work through problems together and share tips for writing clean, Pythonic code.',
        subject: 'Python',
        maxMembers: 15,
        memberCount: 4,
        inviteCode: 'PY26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: fiona.id,
        name: 'Machine Learning Study Circle',
        description:
          "Reading group working through Andrew Ng's ML Specialisation and building small projects. We meet weekly to discuss concepts and code together.",
        subject: 'Machine Learning',
        maxMembers: 8,
        memberCount: 3,
        inviteCode: 'ML26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: evan.id,
        name: 'Web Security & OWASP',
        description:
          'Learning web application security: XSS, CSRF, SQL injection, authentication flaws, and how to defend against them. We review real CVEs and run CTF-style exercises.',
        subject: 'Security',
        maxMembers: 10,
        memberCount: 3,
        inviteCode: 'SEC26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: alice.id,
        name: 'TypeScript Deep Dive',
        description:
          'For developers who know basic TypeScript and want to go further: generics, conditional types, decorators, and building type-safe APIs. Project-driven learning.',
        subject: 'TypeScript',
        maxMembers: 8,
        memberCount: 3,
        inviteCode: 'TS26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: george.id,
        name: 'Mathematics for CS',
        description:
          'Discrete mathematics, linear algebra, and probability theory with a CS focus. We work through problem sets and explain concepts to each other.',
        subject: 'Mathematics',
        maxMembers: 10,
        memberCount: 4,
        inviteCode: 'MATH26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: carol.id,
        name: 'Full-Stack Web Development',
        description:
          'Building complete web applications from database to UI. Current stack: Next.js + Prisma + PostgreSQL. Weekly project builds and code reviews.',
        subject: 'Web Development',
        maxMembers: 12,
        memberCount: 5,
        inviteCode: 'FULL26',
      },
    }),
    prisma.studyGroup.create({
      data: {
        ownerId: bob.id,
        name: 'Open Source Contributors',
        description:
          'Finding and contributing to open-source projects. Learn git collaboration, PR workflows, and how to navigate large codebases.',
        subject: 'Software Engineering',
        maxMembers: 20,
        memberCount: 3,
        inviteCode: 'OSS26',
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

    // Python Basics: hannah (owner) + alice, bob, diana
    prisma.studyGroupMember.create({
      data: { groupId: groupPython.id, userId: hannah.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupPython.id, userId: alice.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupPython.id, userId: bob.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupPython.id, userId: diana.id, role: 'member' },
    }),

    // ML Study Circle: fiona (owner) + george, bob
    prisma.studyGroupMember.create({
      data: { groupId: groupML.id, userId: fiona.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupML.id, userId: george.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupML.id, userId: bob.id, role: 'member' },
    }),

    // Web Security & OWASP: evan (owner) + alice, carol
    prisma.studyGroupMember.create({
      data: { groupId: groupSecurity.id, userId: evan.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupSecurity.id, userId: alice.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupSecurity.id, userId: carol.id, role: 'member' },
    }),

    // TypeScript Deep Dive: alice (owner) + fiona, carol
    prisma.studyGroupMember.create({
      data: { groupId: groupTypeScript.id, userId: alice.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupTypeScript.id, userId: fiona.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupTypeScript.id, userId: carol.id, role: 'member' },
    }),

    // Mathematics for CS: george (owner) + bob, diana, hannah
    prisma.studyGroupMember.create({
      data: { groupId: groupMath.id, userId: george.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupMath.id, userId: bob.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupMath.id, userId: diana.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupMath.id, userId: hannah.id, role: 'member' },
    }),

    // Full-Stack Web Dev: carol (owner) + alice, fiona, diana, evan
    prisma.studyGroupMember.create({
      data: { groupId: groupWebDev.id, userId: carol.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupWebDev.id, userId: alice.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupWebDev.id, userId: fiona.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupWebDev.id, userId: diana.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupWebDev.id, userId: evan.id, role: 'member' },
    }),

    // Open Source Contributors: bob (owner) + alice, fiona
    prisma.studyGroupMember.create({
      data: { groupId: groupOSS.id, userId: bob.id, role: 'admin' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupOSS.id, userId: alice.id, role: 'member' },
    }),
    prisma.studyGroupMember.create({
      data: { groupId: groupOSS.id, userId: fiona.id, role: 'member' },
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
    prisma.studyMaterial.create({
      data: {
        userId: george.id,
        title: 'Machine Learning Fundamentals — Beginner Guide',
        description:
          'Introduction to supervised and unsupervised learning, linear regression, classification, and model evaluation metrics. Includes Python code examples with scikit-learn.',
        fileUrl: 'https://storage.classmate.dev/materials/ml-fundamentals.pdf',
        subject: 'Machine Learning',
        fileType: 'pdf',
        downloads: 95,
        rating: 4.7,
        reviewCount: 28,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: evan.id,
        title: 'Web Security Essentials — OWASP Top 10',
        description:
          'Practical guide to the OWASP Top 10 vulnerabilities: XSS, SQL injection, CSRF, broken authentication, and more. Includes code samples showing vulnerable vs. secure implementations.',
        fileUrl: 'https://storage.classmate.dev/materials/web-security-owasp.pdf',
        subject: 'Security',
        fileType: 'pdf',
        downloads: 58,
        rating: 4.8,
        reviewCount: 15,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: alice.id,
        title: 'Git Workflow for Teams',
        description:
          'Complete guide to Git branching strategies, pull requests, code review workflows, and resolving merge conflicts. Practical for any team size.',
        fileUrl: 'https://storage.classmate.dev/materials/git-workflow-teams.pdf',
        subject: 'Software Engineering',
        fileType: 'pdf',
        downloads: 41,
        rating: 4.3,
        reviewCount: 10,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: george.id,
        title: 'Discrete Mathematics for CS Students',
        description:
          'Covering logic, set theory, relations, graph theory, and combinatorics with CS-focused examples and practice problems. Great supplementary material for algorithm analysis.',
        fileUrl: 'https://storage.classmate.dev/materials/discrete-math-cs.pdf',
        subject: 'Mathematics',
        fileType: 'pdf',
        downloads: 67,
        rating: 4.5,
        reviewCount: 21,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: carol.id,
        title: 'CSS Layout Mastery — Flexbox & Grid',
        description:
          'Hands-on workbook for mastering CSS Flexbox and Grid. Includes 20 layout challenges with solutions, a quick-reference cheat sheet, and common responsive design patterns.',
        fileUrl: 'https://storage.classmate.dev/materials/css-layout-mastery.pdf',
        subject: 'Web Development',
        fileType: 'pdf',
        downloads: 52,
        rating: 4.6,
        reviewCount: 13,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        userId: fiona.id,
        title: 'Linux & Command Line for Developers',
        description:
          'Essential Linux commands, shell scripting basics, file permissions, process management, and SSH. Everything a developer needs to be productive on the command line.',
        fileUrl: 'https://storage.classmate.dev/materials/linux-cli-developers.pdf',
        subject: 'Linux',
        fileType: 'pdf',
        downloads: 34,
        rating: 4.4,
        reviewCount: 9,
      },
    }),
  ])

  // ── Chat Sessions & AI Tutor Messages ─────────────────────────────────────
  console.warn('  Creating AI tutor chat sessions...')
  const [sessionReact, sessionDB, sessionTS, sessionRecursion] = await Promise.all([
    prisma.chatSession.create({
      data: { userId: alice.id, title: 'React useEffect Questions', subject: 'React' },
    }),
    prisma.chatSession.create({
      data: { userId: bob.id, title: 'Database Indexing Help', subject: 'Database' },
    }),
    prisma.chatSession.create({
      data: { userId: fiona.id, title: 'TypeScript Generics Deep Dive', subject: 'TypeScript' },
    }),
    prisma.chatSession.create({
      data: { userId: diana.id, title: 'Understanding Recursion', subject: 'Algorithms' },
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

    // Fiona's TypeScript generics session
    prisma.chatMessage.create({
      data: {
        senderId: fiona.id,
        recipientId: aiTutor.id,
        sessionId: sessionTS.id,
        content:
          "Can you explain TypeScript generics? I understand the basic syntax but I'm not sure when to actually use them.",
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: fiona.id,
        sessionId: sessionTS.id,
        content:
          "Generics let you write functions and classes that work with any type while still being type-safe. The key question is: **does the output type depend on the input type?** If yes, use generics.\n\n```typescript\n// Without generics — loses type information\nfunction first(arr: any[]): any {\n  return arr[0]\n}\n\n// With generics — type flows through\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0]\n}\n\nconst num = first([1, 2, 3])       // TypeScript knows: number | undefined\nconst str = first(['a', 'b', 'c']) // TypeScript knows: string | undefined\n```\n\nCommon use cases:\n- Utility functions (first, last, filter, map)\n- API response wrappers: `ApiResponse<User>`, `ApiResponse<Post>`\n- React components that accept typed data: `List<T>`",
        role: 'assistant',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: fiona.id,
        recipientId: aiTutor.id,
        sessionId: sessionTS.id,
        content: 'That makes sense! What about generic constraints — when do I use `extends`?',
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: fiona.id,
        sessionId: sessionTS.id,
        content:
          'Use `extends` when your function needs to access a specific property on the generic type:\n\n```typescript\n// Without constraint — TypeScript doesn\'t know T has .length\nfunction logLength<T>(value: T) {\n  console.log(value.length) // Error!\n}\n\n// With constraint — T must have a length property\nfunction logLength<T extends { length: number }>(value: T) {\n  console.log(value.length) // Works!\n}\n\nlogLength("hello")   // 5\nlogLength([1, 2, 3]) // 3\nlogLength(42)        // Error — number has no .length\n```\n\nAnother common pattern: `keyof` constraint to ensure type-safe property access:\n\n```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key]\n}\n```',
        role: 'assistant',
        isRead: false,
      },
    }),

    // Diana's recursion session
    prisma.chatMessage.create({
      data: {
        senderId: diana.id,
        recipientId: aiTutor.id,
        sessionId: sessionRecursion.id,
        content:
          "I keep reading about recursion but I just don't get it. Can you explain it simply?",
        role: 'user',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: diana.id,
        sessionId: sessionRecursion.id,
        content:
          'Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs two things:\n\n1. **Base case** — when to stop (no more self-calling)\n2. **Recursive case** — call yourself with a smaller input\n\n```python\ndef factorial(n):\n    # Base case: stop here\n    if n <= 1:\n        return 1\n    # Recursive case: n! = n × (n-1)!\n    return n * factorial(n - 1)\n\nfactorial(4)\n# → 4 * factorial(3)\n# → 4 * 3 * factorial(2)\n# → 4 * 3 * 2 * factorial(1)\n# → 4 * 3 * 2 * 1  ← base case reached\n# → 24\n```\n\nMental model: **trust that the function works for smaller inputs**, then figure out how to reduce your current problem to a smaller one.',
        role: 'assistant',
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: diana.id,
        recipientId: aiTutor.id,
        sessionId: sessionRecursion.id,
        content: 'OK that makes sense for factorial. But how do I apply this to trees?',
        role: 'user',
        isRead: false,
      },
    }),
    prisma.chatMessage.create({
      data: {
        senderId: aiTutor.id,
        recipientId: diana.id,
        sessionId: sessionRecursion.id,
        content:
          "Trees are actually the most natural use of recursion because **a tree is made of smaller trees**. Each node is the root of its own subtree.\n\n```python\nclass Node:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef sum_tree(node):\n    # Base case: empty node contributes 0\n    if node is None:\n        return 0\n    # Recursive case: this node + sum of left subtree + sum of right subtree\n    return node.val + sum_tree(node.left) + sum_tree(node.right)\n```\n\nThe key insight: **you don't need to think about the whole tree**. Just think about what to do with the current node, then trust the recursive calls to handle everything else.",
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
    prisma.event.create({
      data: {
        userId: fiona.id,
        title: 'ML Study Circle — scikit-learn Hands-on',
        description:
          'Building our first classification model with scikit-learn. Bring a laptop with Python and the starter notebook. No prior ML experience required.',
        date: daysFromNow(6),
        startTime: '15:00',
        endTime: '17:00',
        category: 'Study Group',
      },
    }),
    prisma.event.create({
      data: {
        userId: hannah.id,
        title: 'Python Basics — Lists, Loops & Functions',
        description:
          'Beginner-friendly session covering Python fundamentals: lists, for loops, while loops, and writing your first functions. Perfect for first-year students.',
        date: daysFromNow(1),
        startTime: '10:00',
        endTime: '11:30',
        category: 'Study Group',
      },
    }),
    prisma.event.create({
      data: {
        userId: evan.id,
        title: 'Security CTF Challenge Night',
        description:
          "Capture The Flag challenge evening! We'll work through web exploitation and cryptography challenges as a team. No experience needed — great intro to security.",
        date: daysFromNow(10),
        startTime: '19:00',
        endTime: '21:00',
        category: 'Workshop',
      },
    }),
    prisma.event.create({
      data: {
        userId: carol.id,
        title: 'Tutoring: React Hooks & State Management',
        description:
          'Open tutoring session on React state management patterns: useState, useReducer, Context API, and when to use each. Bring your code if you have specific questions.',
        date: daysFromNow(8),
        startTime: '14:00',
        endTime: '15:00',
        category: 'Tutoring',
      },
    }),
  ])

  // ── Connections ────────────────────────────────────────────────────────────
  console.warn('  Creating user connections...')
  await Promise.all([
    // Accepted connections
    prisma.connection.create({
      data: { senderId: alice.id, recipientId: carol.id, status: 'ACCEPTED' },
    }),
    prisma.connection.create({
      data: { senderId: alice.id, recipientId: fiona.id, status: 'ACCEPTED' },
    }),
    prisma.connection.create({
      data: { senderId: bob.id, recipientId: george.id, status: 'ACCEPTED' },
    }),
    prisma.connection.create({
      data: { senderId: bob.id, recipientId: fiona.id, status: 'ACCEPTED' },
    }),
    prisma.connection.create({
      data: { senderId: diana.id, recipientId: carol.id, status: 'ACCEPTED' },
    }),
    prisma.connection.create({
      data: { senderId: hannah.id, recipientId: alice.id, status: 'ACCEPTED' },
    }),
    // Pending requests
    prisma.connection.create({
      data: { senderId: diana.id, recipientId: george.id, status: 'PENDING' },
    }),
    prisma.connection.create({
      data: { senderId: fiona.id, recipientId: evan.id, status: 'PENDING' },
    }),
  ])

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
  console.warn(`    ${posts.length} forum posts (2 pages at limit=10)`)
  console.warn(`    ${replies.length} forum replies`)
  console.warn(`    10 study groups + members`)
  console.warn(`    ${materials.length} study materials (2 pages at limit=10)`)
  console.warn(`    4 AI tutor chat sessions + messages`)
  console.warn(`    7 direct messages`)
  console.warn(`    14 study group messages (React/Algo/DB groups)`)
  console.warn(`    10 events`)
  console.warn(`    8 user connections (6 accepted, 2 pending)`)
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
