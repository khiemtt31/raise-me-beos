export type BlogCategory = {
  id: string
  label: string
  description: string
  badgeClass: string
}

export type BlogAuthor = {
  name: string
  role: string
  handle: string
  avatar: string
}

export type BlogMetric = {
  label: string
  value: string
}

export type BlogHighlight = {
  title: string
  description: string
}

export type BlogSection = {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
  callout?: string
}

export type BlogCover = {
  label: string
  className: string
}

export type BlogPost = {
  slug: string
  title: string
  subtitle: string
  summary: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  author: BlogAuthor
  cover: BlogCover
  signalScore: number
  isFeatured?: boolean
  isTrending?: boolean
  highlights: BlogHighlight[]
  stats: BlogMetric[]
  sections: BlogSection[]
  relatedSlugs: string[]
}

const blogCategories: BlogCategory[] = [
  {
    id: 'strategy',
    label: 'Strategy',
    description: 'Growth and positioning moves from the studio.',
    badgeClass:
      'bg-[var(--hero-accent)]/15 text-[var(--hero-foreground)] border border-[var(--hero-border)]',
  },
  {
    id: 'design',
    label: 'Design',
    description: 'UI craft, color systems, and motion experiments.',
    badgeClass:
      'bg-pink-500/15 text-pink-200 border border-pink-400/40',
  },
  {
    id: 'engineering',
    label: 'Engineering',
    description: 'Architecture notes, performance, and tooling.',
    badgeClass:
      'bg-blue-500/15 text-blue-200 border border-blue-400/40',
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Creator drops, interviews, and collaboration.',
    badgeClass:
      'bg-emerald-500/15 text-emerald-200 border border-emerald-400/40',
  },
  {
    id: 'release',
    label: 'Release',
    description: 'Updates, kits, and launch notes.',
    badgeClass:
      'bg-amber-500/15 text-amber-200 border border-amber-400/40',
  },
]

const blogAuthors: Record<string, BlogAuthor> = {
  hanzo: {
    name: 'Hanzo',
    role: 'Creative Engineer',
    handle: '@hanzo',
    avatar: '/hanzo.png',
  },
  luna: {
    name: 'Luna Park',
    role: 'Motion Director',
    handle: '@luna.motion',
    avatar: '/cat.png',
  },
  rio: {
    name: 'Rio Nakamura',
    role: 'Product Strategist',
    handle: '@rio.signal',
    avatar: '/dog.png',
  },
}

const blogPosts: BlogPost[] = [
  {
    slug: 'signal-drift-portfolio-feed',
    title: 'Signal Drift: Building a Real-Time Portfolio Feed',
    subtitle:
      'How we stitched data, motion, and storytelling into one living wall.',
    summary:
      'A behind-the-scenes look at the live feed system that keeps the portfolio feeling fresh without losing focus.',
    category: 'engineering',
    tags: ['feed', 'realtime', 'nextjs', 'perf'],
    publishedAt: '2026-02-12',
    readTime: '6 min read',
    author: blogAuthors.hanzo,
    cover: {
      label: 'Engineering Brief',
      className:
        'bg-gradient-to-br from-[#2d0f3a] via-[#7a2e5f] to-[#ff8fb1]',
    },
    signalScore: 92,
    isFeatured: true,
    isTrending: true,
    highlights: [
      {
        title: 'Unified feed orchestration',
        description: 'A single stream powering hero, cards, and highlights.',
      },
      {
        title: 'Latency budget under 120ms',
        description: 'Caching and optimistic rendering keep the feed snappy.',
      },
      {
        title: 'Motion tuned to data',
        description: 'Transitions respond to update frequency, not scroll alone.',
      },
    ],
    stats: [
      { label: 'Avg refresh', value: '45s' },
      { label: 'Payload size', value: '18kb' },
      { label: 'Release cycle', value: 'Weekly' },
    ],
    sections: [
      {
        id: 'problem',
        title: 'The Problem We Had to Solve',
        paragraphs: [
          'The old portfolio felt static. It looked good, but it did not move with our weekly releases.',
          'We needed a system that could highlight new work without forcing a rebuild of the layout each time.',
        ],
      },
      {
        id: 'architecture',
        title: 'Architecture Notes',
        paragraphs: [
          'We used a light API layer that merges CMS updates with local highlights.',
          'The UI listens for changes and swaps cards in place so the layout stays stable.',
        ],
        bullets: [
          'Pre-sorted feed data with stable keys.',
          'Optimistic render with silent revalidation.',
          'Motion timing based on update cadence.',
        ],
      },
      {
        id: 'results',
        title: 'Results and What Changed',
        paragraphs: [
          'The feed refresh is now subtle but constant, and the team can publish updates in minutes.',
          'Most importantly, the story arc of the portfolio stays intact while still feeling alive.',
        ],
        callout:
          'The feed now behaves like a living signal wall instead of a static showcase.',
      },
    ],
    relatedSlugs: [
      'motion-rituals-7-animations',
      'qr-lives-payment-flow',
      'release-notes-winter-26-ui-kit',
    ],
  },
  {
    slug: 'neon-commerce-one-tap-trust',
    title: 'Neon Commerce: Designing Checkout for One-Tap Trust',
    subtitle: 'A story about clarity, speed, and invisible friction removal.',
    summary:
      'We rebuilt our checkout UI to earn trust in under 3 seconds. Here is what changed and why it worked.',
    category: 'strategy',
    tags: ['checkout', 'ux', 'growth'],
    publishedAt: '2026-02-09',
    readTime: '5 min read',
    author: blogAuthors.rio,
    cover: {
      label: 'Strategy Dispatch',
      className:
        'bg-gradient-to-br from-[#1f1a4a] via-[#5f3dc4] to-[#00c2ff]',
    },
    signalScore: 88,
    isTrending: true,
    highlights: [
      {
        title: 'Trust cues above the fold',
        description: 'Security and clarity are visible without scrolling.',
      },
      {
        title: 'Fewer inputs, higher clarity',
        description: 'We removed two fields and increased completion by 17%.',
      },
      {
        title: 'Rhythm-based spacing',
        description: 'The layout breathes, so users feel in control.',
      },
    ],
    stats: [
      { label: 'Completion lift', value: '+17%' },
      { label: 'Time to trust', value: '2.8s' },
      { label: 'Test variants', value: '6' },
    ],
    sections: [
      {
        id: 'friction',
        title: 'Where the Friction Hid',
        paragraphs: [
          'The previous checkout felt dense and asked for trust too late.',
          'We audited every field and every line of copy to remove hesitation.',
        ],
      },
      {
        id: 'changes',
        title: 'What We Shipped',
        paragraphs: [
          'We moved verification signals closer to the CTA and tightened the flow to three steps.',
        ],
        bullets: [
          'Inline verification badges with clear language.',
          'One-tap preset options for popular amounts.',
          'Progress state feedback after every action.',
        ],
      },
      {
        id: 'impact',
        title: 'Impact on the Signal',
        paragraphs: [
          'Users completed checkout faster and asked fewer support questions.',
          'The calmer layout directly contributed to higher trust metrics.',
        ],
      },
    ],
    relatedSlugs: [
      'qr-lives-payment-flow',
      'signal-drift-portfolio-feed',
      'studio-ops-design-sprints',
    ],
  },
  {
    slug: 'motion-rituals-7-animations',
    title: 'Motion Rituals: The 7 Animations That Keep People Scanning',
    subtitle: 'Subtle movement that keeps the story alive.',
    summary:
      'A field guide to the micro-motions we use to direct attention without noise.',
    category: 'design',
    tags: ['motion', 'ui', 'animation'],
    publishedAt: '2026-02-06',
    readTime: '7 min read',
    author: blogAuthors.luna,
    cover: {
      label: 'Motion Lab',
      className:
        'bg-gradient-to-br from-[#38162f] via-[#d94f8a] to-[#ffb74d]',
    },
    signalScore: 85,
    isTrending: true,
    highlights: [
      {
        title: 'Entrance timing by hierarchy',
        description: 'Primary elements arrive first, then supporting details.',
      },
      {
        title: 'Scroll-coupled emphasis',
        description: 'Motion intensity matches scroll velocity.',
      },
      {
        title: 'Ambient loops',
        description: 'Small ambient loops keep the UI alive without distraction.',
      },
    ],
    stats: [
      { label: 'Animation sets', value: '7' },
      { label: 'Avg duration', value: '320ms' },
      { label: 'Loops', value: '3' },
    ],
    sections: [
      {
        id: 'philosophy',
        title: 'Why Motion Matters',
        paragraphs: [
          'Motion sets rhythm and gives users a sense of spatial memory.',
          'We design motion like music, with pauses and crescendos.',
        ],
      },
      {
        id: 'stack',
        title: 'Our Animation Stack',
        paragraphs: [
          'We keep animations GPU friendly and avoid long paint chains.',
        ],
        bullets: [
          'Opacity and transform only.',
          'Staggered reveals with 60-120ms delays.',
          'Respect prefers-reduced-motion.',
        ],
      },
      {
        id: 'rituals',
        title: 'Rituals We Repeat',
        paragraphs: [
          'Consistent motion rituals train the user where to look next.',
        ],
        callout:
          'If motion does not clarify the story, we remove it entirely.',
      },
    ],
    relatedSlugs: [
      'signal-drift-portfolio-feed',
      'gridcraft-color-system',
      'community-pulse-500-creators',
    ],
  },
  {
    slug: 'qr-lives-payment-flow',
    title: 'QR Lives: The Payment Flow That Cut Drop-off by 34%',
    subtitle: 'From scan to success without friction.',
    summary:
      'We measured every step in the QR payment journey and redesigned the moments that caused hesitation.',
    category: 'engineering',
    tags: ['payments', 'qr', 'conversion'],
    publishedAt: '2026-02-02',
    readTime: '6 min read',
    author: blogAuthors.rio,
    cover: {
      label: 'Performance Review',
      className:
        'bg-gradient-to-br from-[#0c1b3d] via-[#3751c1] to-[#00f0ff]',
    },
    signalScore: 81,
    highlights: [
      {
        title: 'Fewer exits mid-scan',
        description: 'We removed visual noise around the QR.',
      },
      {
        title: 'Better error recovery',
        description: 'Instant fallback paths keep the flow alive.',
      },
      {
        title: 'Clear progress states',
        description: 'Users always know what is happening.',
      },
    ],
    stats: [
      { label: 'Drop-off cut', value: '-34%' },
      { label: 'Avg scan time', value: '11s' },
      { label: 'Fallback usage', value: '9%' },
    ],
    sections: [
      {
        id: 'audit',
        title: 'Audit of the QR Flow',
        paragraphs: [
          'We watched 40 sessions and identified the three most common stall points.',
        ],
      },
      {
        id: 'redesign',
        title: 'Flow Redesign',
        paragraphs: [
          'We simplified the scan screen and added subtle confirmation cues.',
        ],
        bullets: [
          'Cleaner scan area with fewer distractions.',
          'In-progress state with time remaining.',
          'Fallback CTA anchored at the bottom.',
        ],
      },
      {
        id: 'measurement',
        title: 'Measurement and Learnings',
        paragraphs: [
          'The new flow reduced drop-off and improved support ticket volume.',
        ],
      },
    ],
    relatedSlugs: [
      'neon-commerce-one-tap-trust',
      'signal-drift-portfolio-feed',
      'release-notes-winter-26-ui-kit',
    ],
  },
  {
    slug: 'studio-ops-design-sprints',
    title: 'Studio Ops: How We Run Weekly Design Sprints',
    subtitle: 'A playbook for fast, focused collaboration.',
    summary:
      'Our sprint ritual balances research, rapid design, and build-ready handoff in five days.',
    category: 'strategy',
    tags: ['process', 'team', 'sprint'],
    publishedAt: '2026-01-28',
    readTime: '4 min read',
    author: blogAuthors.hanzo,
    cover: {
      label: 'Ops Notebook',
      className:
        'bg-gradient-to-br from-[#242018] via-[#8b5f2f] to-[#f7c873]',
    },
    signalScore: 76,
    highlights: [
      {
        title: 'Shorter cycles, better focus',
        description: 'Weekly sprints keep momentum without burnout.',
      },
      {
        title: 'Crisp handoffs',
        description: 'Design-to-dev alignment happens daily.',
      },
      {
        title: 'Measured outputs',
        description: 'Every sprint ends with a shipping goal.',
      },
    ],
    stats: [
      { label: 'Sprint length', value: '5 days' },
      { label: 'Team size', value: '7' },
      { label: 'Ship rate', value: '92%' },
    ],
    sections: [
      {
        id: 'cadence',
        title: 'Cadence and Rituals',
        paragraphs: [
          'We anchor the week with a Monday brief and a Friday demo.',
        ],
      },
      {
        id: 'roles',
        title: 'Roles in the Room',
        paragraphs: [
          'Every sprint pairs a design lead with an engineer to eliminate gaps.',
        ],
        bullets: [
          'Design lead to own narrative.',
          'Engineer partner for feasibility.',
          'Ops partner for scope control.',
        ],
      },
      {
        id: 'handoff',
        title: 'Handoff Without Friction',
        paragraphs: [
          'We treat handoff like a live workshop, not a file transfer.',
        ],
      },
    ],
    relatedSlugs: [
      'neon-commerce-one-tap-trust',
      'gridcraft-color-system',
      'release-notes-winter-26-ui-kit',
    ],
  },
  {
    slug: 'community-pulse-500-creators',
    title: 'Community Pulse: 500 Creators Tested the New Kit',
    subtitle: 'Insights from our closed beta drop.',
    summary:
      'We gathered feedback from 500 creators and mapped the insights into the next release.',
    category: 'community',
    tags: ['community', 'feedback', 'beta'],
    publishedAt: '2026-01-22',
    readTime: '5 min read',
    author: blogAuthors.luna,
    cover: {
      label: 'Community Radar',
      className:
        'bg-gradient-to-br from-[#0a2a1f] via-[#1c6f5a] to-[#7cfcc8]',
    },
    signalScore: 73,
    highlights: [
      {
        title: 'Stronger onboarding',
        description: 'Creators want clearer first steps.',
      },
      {
        title: 'More export formats',
        description: 'Demand for flexible output keeps rising.',
      },
      {
        title: 'Live collaboration',
        description: 'Teams are ready for shared editing.',
      },
    ],
    stats: [
      { label: 'Creators', value: '500' },
      { label: 'Sessions', value: '1.8k' },
      { label: 'Top request', value: 'Collab' },
    ],
    sections: [
      {
        id: 'survey',
        title: 'What We Asked',
        paragraphs: [
          'We focused on onboarding, export, and collaboration readiness.',
        ],
      },
      {
        id: 'findings',
        title: 'Top Findings',
        paragraphs: [
          'Speed mattered most, but clarity on the first run was the key driver.',
        ],
        bullets: [
          'Creators want guided onboarding.',
          'Export choices need to be visible earlier.',
          'Teams crave shared editing and comments.',
        ],
      },
      {
        id: 'next',
        title: 'What We Ship Next',
        paragraphs: [
          'We are building a first-run tour and new export presets right now.',
        ],
      },
    ],
    relatedSlugs: [
      'motion-rituals-7-animations',
      'studio-ops-design-sprints',
      'release-notes-winter-26-ui-kit',
    ],
  },
  {
    slug: 'gridcraft-color-system',
    title: 'Gridcraft: A Color System for Neon Clarity',
    subtitle: 'Balancing glow with readability.',
    summary:
      'We rebuilt the palette to keep the neon spirit while staying accessible and calm.',
    category: 'design',
    tags: ['color', 'tokens', 'accessibility'],
    publishedAt: '2026-01-18',
    readTime: '6 min read',
    author: blogAuthors.hanzo,
    cover: {
      label: 'Design System',
      className:
        'bg-gradient-to-br from-[#1d1142] via-[#6040e6] to-[#f8a3ff]',
    },
    signalScore: 69,
    highlights: [
      {
        title: 'Contrast audits',
        description: 'Every pair tested at AA and AAA thresholds.',
      },
      {
        title: 'Dual-mode palettes',
        description: 'Light and dark palettes share one token set.',
      },
      {
        title: 'Color as hierarchy',
        description: 'Accent colors now signal action priority.',
      },
    ],
    stats: [
      { label: 'Tokens', value: '48' },
      { label: 'Themes', value: '3' },
      { label: 'AA compliance', value: '100%' },
    ],
    sections: [
      {
        id: 'palette',
        title: 'Palette Strategy',
        paragraphs: [
          'We focused on hue families that hold contrast across backgrounds.',
        ],
      },
      {
        id: 'tokens',
        title: 'Token Mapping',
        paragraphs: [
          'Tokens now map to function instead of arbitrary hue names.',
        ],
        bullets: [
          'Primary, secondary, tertiary tiers.',
          'Action, warning, success rails.',
          'Background levels with clear steps.',
        ],
      },
      {
        id: 'impact',
        title: 'Impact on Readability',
        paragraphs: [
          'We saw immediate improvement in scannability tests.',
        ],
      },
    ],
    relatedSlugs: [
      'motion-rituals-7-animations',
      'community-pulse-500-creators',
      'studio-ops-design-sprints',
    ],
  },
  {
    slug: 'release-notes-winter-26-ui-kit',
    title: 'Release Notes: Winter 26 UI Kit',
    subtitle: 'Everything new in the latest release.',
    summary:
      'The Winter 26 UI Kit adds layout presets, motion tokens, and new templates.',
    category: 'release',
    tags: ['release', 'kit', 'update'],
    publishedAt: '2026-01-12',
    readTime: '4 min read',
    author: blogAuthors.hanzo,
    cover: {
      label: 'Release Signal',
      className:
        'bg-gradient-to-br from-[#1a1a1a] via-[#5c2d2d] to-[#ff6b6b]',
    },
    signalScore: 64,
    highlights: [
      {
        title: 'New layout presets',
        description: 'Five layouts to launch faster.',
      },
      {
        title: 'Motion tokens',
        description: 'Reusable motion primitives for every view.',
      },
      {
        title: 'Template library',
        description: 'Updated cards and hero sections.',
      },
    ],
    stats: [
      { label: 'Templates', value: '12' },
      { label: 'Layouts', value: '5' },
      { label: 'Tokens', value: '24' },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Release Overview',
        paragraphs: [
          'This release focuses on speed to launch and visual consistency.',
        ],
      },
      {
        id: 'whats-new',
        title: 'What Is New',
        paragraphs: [
          'We introduced flexible grid templates and new motion variables.',
        ],
        bullets: [
          'Five new hero and grid presets.',
          'Expanded motion token library.',
          'Refined typography scale.',
        ],
      },
      {
        id: 'next',
        title: 'Next on the Roadmap',
        paragraphs: [
          'Next release includes collaborative commenting and export modes.',
        ],
      },
    ],
    relatedSlugs: [
      'signal-drift-portfolio-feed',
      'studio-ops-design-sprints',
      'community-pulse-500-creators',
    ],
  },
]

const sortByDateDesc = (a: BlogPost, b: BlogPost) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

export const getBlogCategories = () => blogCategories

export const getBlogCategory = (categoryId: string) =>
  blogCategories.find((category) => category.id === categoryId)

export const getBlogs = () => [...blogPosts].sort(sortByDateDesc)

export const getFeaturedBlog = () =>
  getBlogs().find((blog) => blog.isFeatured) ?? getBlogs()[0]

export const getLatestBlogs = (limit: number, excludeSlugs: string[] = []) =>
  getBlogs()
    .filter((blog) => !excludeSlugs.includes(blog.slug))
    .slice(0, limit)

export const getTrendingBlogs = (limit: number) =>
  getBlogs()
    .filter((blog) => blog.isTrending)
    .sort((a, b) => b.signalScore - a.signalScore)
    .slice(0, limit)

export const getBlogBySlug = (slug: string) =>
  blogPosts.find((blog) => blog.slug === slug)

export const getRelatedBlogs = (slug: string, limit = 3) => {
  const blog = getBlogBySlug(slug)
  if (!blog) return []

  const related = blog.relatedSlugs
    .map((relatedSlug) => getBlogBySlug(relatedSlug))
    .filter((value): value is BlogPost => Boolean(value))

  if (related.length >= limit) return related.slice(0, limit)

  const categoryMatches = getBlogs().filter(
    (item) =>
      item.slug !== slug &&
      item.category === blog.category &&
      !related.some((entry) => entry.slug === item.slug)
  )

  return [...related, ...categoryMatches].slice(0, limit)
}

const parseBlogDate = (value: string) =>
  new Date(value.includes('T') ? value : `${value}T00:00:00`)

export const formatBlogDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parseBlogDate(value))
