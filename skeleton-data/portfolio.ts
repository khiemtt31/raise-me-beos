import { Layers, Shield, Sparkles, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type SectionId = 'hero' | 'story' | 'milestones' | 'projects'

export type Section = {
  id: SectionId
  label: string
}

export type HeroContent = {
  pill: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  tags: string[]
  scrollHint: string
}

export type DonationContent = {
  eyebrow: string
  title: string
  amountLabel: string
  customAmountLabel: string
  customAmountPlaceholder: string
  nameLabel: string
  namePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  anonymousLabel: string
  buttonLabel: string
  processingLabel: string
}

export type StoryContent = {
  eyebrow: string
  title: string
  description: string
}

export type Stat = {
  label: string
  value: string
}

export type Signal = {
  title: string
  description: string
  detail: string
  icon: LucideIcon
}

export type MilestoneContent = {
  eyebrow: string
  title: string
  status: string
}

export type Milestone = {
  year: string
  title: string
  description: string
}

export type ProjectsContent = {
  eyebrow: string
  title: string
  cta: string
}

export type Project = {
  title: string
  type: string
  description: string
}

export type ContactContent = {
  eyebrow: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
  email: string
}

export type FooterContent = {
  brand: string
  copyright: string
  tagline: string
}

export type SiteContent = {
  name: string
  supportLabel: string
  paymentTitle: string
  paymentDescription: string
  paymentClose: string
  paymentOpen: string
}

export const sections: Section[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'story', label: 'Story' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'projects', label: 'Drops' },
]

export const heroContent: HeroContent = {
  pill: 'Signal ready',
  title: 'Crafting neon narratives for fearless founders and glowing brands.',
  subtitle:
    'I design cyberpunk interfaces that feel alive, with motion, clarity, and instant payment portals that let supporters fuel the next build.',
  primaryCta: 'View drops',
  secondaryCta: 'See milestones',
  tags: ['UI systems', 'Motion rituals', 'Instant QR'],
  scrollHint: 'Scroll for the signal',
}

export const siteContent: SiteContent = {
  name: 'Neon Portfolio',
  supportLabel: 'Support',
  paymentTitle: 'Complete your payment',
  paymentDescription: 'Scan this QR code with your banking app to complete payment.',
  paymentClose: 'Close',
  paymentOpen: 'Open payment page',
}

export const donationContent: DonationContent = {
  eyebrow: 'Support node',
  title: 'Instant QR donation',
  amountLabel: 'Amount',
  customAmountLabel: 'Custom amount (min 10,000 VND)',
  customAmountPlaceholder: 'Enter amount',
  nameLabel: 'Your name',
  namePlaceholder: 'Anonymous',
  messageLabel: 'Message',
  messagePlaceholder: 'Leave a message...',
  anonymousLabel: 'Donate anonymously',
  buttonLabel: 'Generate QR',
  processingLabel: 'Processing...',
}

export const donationPresets = [10000, 20000, 50000, 100000, 200000, 500000]

export const storyContent: StoryContent = {
  eyebrow: 'Signal story',
  title: 'A portfolio built for relentless glow and clear intent.',
  description:
    'This is a living archive of interface craft, motion loops, and payment clarity. Every section is a node in the same network: bold, fast, and designed to invite support.',
}

export const stats: Stat[] = [
  { label: 'Drops shipped', value: '28' },
  { label: 'Signal partners', value: '16' },
  { label: 'Cities scanned', value: '09' },
]

export const signals: Signal[] = [
  {
    title: 'Neon Strategy',
    description:
      'Brand systems mapped to high-intensity storytelling, tuned for the long scroll.',
    icon: Sparkles,
    detail: '01 Signal grid',
  },
  {
    title: 'Motion Systems',
    description:
      'Scroll and hover choreography built for rhythm, clarity, and instant recall.',
    icon: Zap,
    detail: '02 Motion core',
  },
  {
    title: 'Interface Architecture',
    description:
      'Tokenized UI and layout engineering to keep every drop consistent and fast.',
    icon: Layers,
    detail: '03 Layout matrix',
  },
  {
    title: 'Trust Layer',
    description:
      'Conversion-first flows with clean UX logic and secure payment handoffs.',
    icon: Shield,
    detail: '04 Trust signal',
  },
]

export const milestoneContent: MilestoneContent = {
  eyebrow: 'Milestone tree',
  title: 'The in-out path of the neon build.',
  status: 'Live signal',
}

export const milestones: Milestone[] = [
  {
    year: '2021',
    title: 'Signal Ignition',
    description: 'Built the first neon identity system and learned to bend type.',
  },
  {
    year: '2022',
    title: 'Prototype Sprint',
    description: 'Shipped rapid MVPs for fintech and creator platforms.',
  },
  {
    year: '2023',
    title: 'Motion Rituals',
    description: 'Focused on scroll narrative and cinematic UI transitions.',
  },
  {
    year: '2024',
    title: 'Flow Architecture',
    description: 'Scaled design systems for payment, community, and growth.',
  },
  {
    year: '2025',
    title: 'Neon Portfolio',
    description: 'Curated the cyberpunk identity and donation portal.',
  },
]

export const projectsContent: ProjectsContent = {
  eyebrow: 'Latest drops',
  title: 'A curated feed of cinematic UI work.',
  cta: 'Fuel the next drop',
}

export const projects: Project[] = [
  {
    title: 'Ghost Wallet',
    type: 'Fintech UI',
    description: 'A luminous wallet experience with instant QR pay flow.',
  },
  {
    title: 'Pulse Gallery',
    type: 'Creator Hub',
    description: 'A visual story feed with aggressive motion and clarity.',
  },
  {
    title: 'Signal Vault',
    type: 'Community',
    description: 'Membership dashboard built for fast scanning and retention.',
  },
]

export const contactContent: ContactContent = {
  eyebrow: 'Let us sync',
  title: 'Ready to build something luminous together?',
  description:
    'Reach out for collaborations, commissions, or to keep the neon engine alive with a quick QR scan.',
  primaryCta: 'Start a project',
  secondaryCta: 'Donate now',
  email: 'hello@neon.studio',
}

export const footerContent: FooterContent = {
  brand: 'Neon Signal Studio',
  copyright: 'All rights reserved.',
  tagline: 'Built in neon. Powered by support.',
}
