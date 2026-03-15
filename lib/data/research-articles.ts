export type ArticleSource = 'University' | 'Professional' | 'Tutor'

export interface Article {
  id: number
  title: string
  description: string
  image: string
  category: string
  readTime: string
  timestamp: string
  source: {
    name: string
    type: ArticleSource
    verified: boolean
  }
  author: {
    name: string
    role: string
    avatar: string
  }
  tags: string[]
}

export const articles: Article[] = [
  {
    id: 0,
    title: 'Neural Pathways in Collaborative Learning: Longitudinal Study',
    description:
      'This longitudinal study investigates the neurobiological correlates of collaborative learning among university students using high-resolution fMRI monitoring over a 24-month period.',
    image: 'from-blue-900 to-indigo-900',
    category: 'Neuroscience',
    readTime: '15 min read',
    timestamp: 'Just now',
    source: {
      name: 'Oxford Neuroscience Lab',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Elias Thorne',
      role: 'Lead Researcher',
      avatar: 'ET',
    },
    tags: ['Neuroscience', 'Learning', 'fMRI'],
  },
  {
    id: 1,
    title: 'The Future of Generative Models in Undergraduate Education',
    description:
      'An in-depth analysis of how large language models are reshaping the curriculum for computer science majors, focusing on ethical considerations and practical applications.',
    image: 'from-blue-600 to-indigo-600',
    category: 'Computer Science',
    readTime: '12 min read',
    timestamp: '2h ago',
    source: {
      name: 'MIT Research Lab',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Alan Grant',
      role: 'Lead Researcher',
      avatar: 'AG',
    },
    tags: ['AI', 'Education', 'Ethics'],
  },
  {
    id: 2,
    title: 'CRISPR Applications: Beyond the Genome Editing Hype',
    description:
      'Exploring the practical applications of gene editing in modern immunology and the potential for personalized medicine in the next decade.',
    image: 'from-emerald-600 to-teal-600',
    category: 'Biology',
    readTime: '8 min read',
    timestamp: '5h ago',
    source: {
      name: 'Stanford Medicine',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Prof. Sarah Jenkins',
      role: 'Clinical Director',
      avatar: 'SJ',
    },
    tags: ['Genetics', 'Medicine', 'BioTech'],
  },
  {
    id: 3,
    title: 'Reinterpreting the Renaissance: A Digital Humanities Approach',
    description:
      'How new digital archiving tools are revealing previously unknown connections between artists and patrons in 15th century Florence.',
    image: 'from-amber-600 to-orange-600',
    category: 'Humanities',
    readTime: '15 min read',
    timestamp: '1d ago',
    source: {
      name: 'Historical Review',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Marcus Chen, PhD',
      role: 'Historian',
      avatar: 'MC',
    },
    tags: ['History', 'Art', 'Digital'],
  },
  {
    id: 4,
    title: 'Quantum Computing: Breaking Down the Qubit Barrier',
    description:
      'Recent breakthroughs in error correction are bringing us closer to stable quantum processors. What does this mean for cryptography?',
    image: 'from-violet-600 to-purple-600',
    category: 'Physics',
    readTime: '10 min read',
    timestamp: '1d ago',
    source: {
      name: 'Physics Today',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Dr. Elena Rodriguez',
      role: 'Quantum Physicist',
      avatar: 'ER',
    },
    tags: ['Quantum', 'Computing', 'Physics'],
  },
  {
    id: 5,
    title: 'Sustainable Urban Planning in the Post-Pandemic Era',
    description:
      "Architects and city planners are rethinking public spaces. A look at the new '15-minute city' concepts emerging in Europe.",
    image: 'from-green-600 to-emerald-600',
    category: 'Architecture',
    readTime: '7 min read',
    timestamp: '2d ago',
    source: {
      name: 'Urban Design Institute',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'David Kim',
      role: 'Urban Planner',
      avatar: 'DK',
    },
    tags: ['Urban Planning', 'Sustainability'],
  },
  {
    id: 6,
    title: 'Machine Learning for Climate Change Prediction',
    description:
      'Leveraging deep learning to model complex climate patterns and predict extreme weather events with greater accuracy.',
    image: 'from-cyan-600 to-blue-600',
    category: 'Environmental Science',
    readTime: '9 min read',
    timestamp: '2d ago',
    source: {
      name: 'Climate Action Lab',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Emily Chen',
      role: 'Climate Scientist',
      avatar: 'EC',
    },
    tags: ['Climate', 'AI', 'Environment'],
  },
  {
    id: 7,
    title: 'The Psychology of Remote Work: A Longitudinal Study',
    description:
      'Analyzing the long-term effects of remote work on employee well-being, productivity, and team cohesion over a 3-year period.',
    image: 'from-rose-600 to-pink-600',
    category: 'Psychology',
    readTime: '11 min read',
    timestamp: '3d ago',
    source: {
      name: 'Behavioral Insights',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Dr. Michael Ross',
      role: 'Psychologist',
      avatar: 'MR',
    },
    tags: ['Psychology', 'Work', 'Mental Health'],
  },
  {
    id: 8,
    title: 'Advanced Calculus: Visualizing Multivariable Functions',
    description:
      "A tutor's guide to helping students intuitively understand partial derivatives and multiple integrals through 3D visualization.",
    image: 'from-blue-500 to-sky-500',
    category: 'Mathematics',
    readTime: '6 min read',
    timestamp: '3d ago',
    source: {
      name: 'Math Whiz Tutors',
      type: 'Tutor',
      verified: true,
    },
    author: {
      name: 'Sarah Jenkins',
      role: 'Top Rated Tutor',
      avatar: 'SJ',
    },
    tags: ['Calculus', 'Math', 'Education'],
  },
  {
    id: 9,
    title: 'Blockchain in Supply Chain Management',
    description:
      'How distributed ledger technology is increasing transparency and reducing fraud in global logistics networks.',
    image: 'from-orange-500 to-red-500',
    category: 'Business',
    readTime: '8 min read',
    timestamp: '4d ago',
    source: {
      name: 'Global Logistics Review',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'James Wilson',
      role: 'Supply Chain Analyst',
      avatar: 'JW',
    },
    tags: ['Blockchain', 'Business', 'Tech'],
  },
  {
    id: 10,
    title: 'Neurolinguistics: How the Brain Processes Second Languages',
    description:
      'New fMRI studies reveal distinct neural pathways for native vs. second language processing in bilingual adults.',
    image: 'from-fuchsia-600 to-pink-600',
    category: 'Linguistics',
    readTime: '14 min read',
    timestamp: '4d ago',
    source: {
      name: 'Cognitive Science Journal',
      type: 'University',
      verified: true,
    },
    author: {
      name: 'Dr. Lisa Wong',
      role: 'Neuroscientist',
      avatar: 'LW',
    },
    tags: ['Linguistics', 'Neuroscience', 'Language'],
  },
  {
    id: 11,
    title: 'Cybersecurity Trends: Zero Trust Architecture',
    description:
      'Why traditional perimeter-based security models are failing and how Zero Trust principles are becoming the new standard.',
    image: 'from-slate-700 to-gray-800',
    category: 'Cybersecurity',
    readTime: '9 min read',
    timestamp: '5d ago',
    source: {
      name: 'Tech Security Weekly',
      type: 'Professional',
      verified: true,
    },
    author: {
      name: 'Alex Mercer',
      role: 'Security Consultant',
      avatar: 'AM',
    },
    tags: ['Security', 'Tech', 'Cyber'],
  },
  {
    id: 12,
    title: 'The Art of Storytelling in Data Visualization',
    description:
      'Transforming raw data into compelling narratives. Best practices for creating dashboards that drive decision-making.',
    image: 'from-yellow-500 to-amber-600',
    category: 'Data Science',
    readTime: '7 min read',
    timestamp: '6d ago',
    source: {
      name: 'Data Viz Daily',
      type: 'Tutor',
      verified: true,
    },
    author: {
      name: 'Elena Rodriguez',
      role: 'Data Science Tutor',
      avatar: 'ER',
    },
    tags: ['Data Science', 'Design', 'Storytelling'],
  },
]
