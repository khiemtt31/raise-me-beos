import { Layers, Shield, Sparkles, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Translator = (
  key: string,
  values?: Record<string, string | number>
) => string

export type SectionId = 'hero' | 'story' | 'projects'

export type Section = {
  id: SectionId
  label: string
}

export type HeroContent = {
  pill: string
  title: string
  subtitle: string
  primaryCta: string
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
  value: number
}

export type Signal = {
  title: string
  description: string
  detail: string
  icon: LucideIcon
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

type DonationContentOptions = {
  minAmountLabel: string
  currencyLabel: string
}

export const getSections = (t: Translator): Section[] => [
  { id: 'hero', label: t('HOME.SECTION.001') },
  { id: 'story', label: t('HOME.SECTION.002') },
  { id: 'projects', label: t('HOME.SECTION.003') },
]

export const getHeroContent = (t: Translator): HeroContent => ({
  pill: t('HOME.PILL.001'),
  title: t('HOME.TITLE.001'),
  subtitle: t('HOME.TEXT.001'),
  primaryCta: t('HOME.BUTTON.001'),
  tags: [t('HOME.TAG.001'), t('HOME.TAG.002'), t('HOME.TAG.003')],
  scrollHint: t('HOME.LABEL.001'),
})

export const getSiteContent = (t: Translator): SiteContent => ({
  name: t('SITE.NAME.001'),
  supportLabel: t('SITE.LABEL.001'),
  paymentTitle: t('PAYMENT.TITLE.001'),
  paymentDescription: t('PAYMENT.TEXT.001'),
  paymentClose: t('PAYMENT.BUTTON.001'),
  paymentOpen: t('PAYMENT.BUTTON.002'),
})

export const getDonationContent = (
  t: Translator,
  options: DonationContentOptions
): DonationContent => ({
  eyebrow: t('DONATE.EYEBROW.001'),
  title: t('DONATE.TITLE.001'),
  amountLabel: t('DONATE.LABEL.AMOUNT.001'),
  customAmountLabel: t('DONATE.LABEL.CUSTOM_AMOUNT.001', {
    min: options.minAmountLabel,
    currency: options.currencyLabel,
  }),
  customAmountPlaceholder: t('DONATE.PLACEHOLDER.CUSTOM_AMOUNT.001'),
  nameLabel: t('DONATE.LABEL.NAME.001'),
  namePlaceholder: t('DONATE.PLACEHOLDER.NAME.001'),
  messageLabel: t('DONATE.LABEL.MESSAGE.001'),
  messagePlaceholder: t('DONATE.PLACEHOLDER.MESSAGE.001'),
  anonymousLabel: t('DONATE.LABEL.ANONYMOUS.001'),
  buttonLabel: t('DONATE.BUTTON.SUBMIT.001'),
  processingLabel: t('DONATE.BUTTON.PROCESSING.001'),
})

export const donationPresets = [10000, 20000, 50000, 100000, 200000, 500000]

export const getStoryContent = (t: Translator): StoryContent => ({
  eyebrow: t('HOME.STORY.EYEBROW.001'),
  title: t('HOME.STORY.TITLE.001'),
  description: t('HOME.STORY.TEXT.001'),
})

export const getStats = (t: Translator): Stat[] => [
  { label: t('HOME.STATS.LABEL.001'), value: 28 },
  { label: t('HOME.STATS.LABEL.002'), value: 16 },
  { label: t('HOME.STATS.LABEL.003'), value: 9 },
]

export const getSignals = (t: Translator): Signal[] => [
  {
    title: t('HOME.SIGNAL.TITLE.001'),
    description: t('HOME.SIGNAL.TEXT.001'),
    icon: Sparkles,
    detail: t('HOME.SIGNAL.DETAIL.001'),
  },
  {
    title: t('HOME.SIGNAL.TITLE.002'),
    description: t('HOME.SIGNAL.TEXT.002'),
    icon: Zap,
    detail: t('HOME.SIGNAL.DETAIL.002'),
  },
  {
    title: t('HOME.SIGNAL.TITLE.003'),
    description: t('HOME.SIGNAL.TEXT.003'),
    icon: Layers,
    detail: t('HOME.SIGNAL.DETAIL.003'),
  },
  {
    title: t('HOME.SIGNAL.TITLE.004'),
    description: t('HOME.SIGNAL.TEXT.004'),
    icon: Shield,
    detail: t('HOME.SIGNAL.DETAIL.004'),
  },
]

export const getProjectsContent = (t: Translator): ProjectsContent => ({
  eyebrow: t('HOME.PROJECTS.EYEBROW.001'),
  title: t('HOME.PROJECTS.TITLE.001'),
  cta: t('HOME.PROJECTS.BUTTON.001'),
})

export const getProjects = (t: Translator): Project[] => [
  {
    title: t('HOME.PROJECT.TITLE.001'),
    type: t('HOME.PROJECT.TYPE.001'),
    description: t('HOME.PROJECT.TEXT.001'),
  },
  {
    title: t('HOME.PROJECT.TITLE.002'),
    type: t('HOME.PROJECT.TYPE.002'),
    description: t('HOME.PROJECT.TEXT.002'),
  },
  {
    title: t('HOME.PROJECT.TITLE.003'),
    type: t('HOME.PROJECT.TYPE.003'),
    description: t('HOME.PROJECT.TEXT.003'),
  },
]

export const getContactContent = (t: Translator): ContactContent => ({
  eyebrow: t('HOME.CONTACT.EYEBROW.001'),
  title: t('HOME.CONTACT.TITLE.001'),
  description: t('HOME.CONTACT.TEXT.001'),
  primaryCta: t('HOME.CONTACT.BUTTON.001'),
  secondaryCta: t('HOME.CONTACT.BUTTON.002'),
  email: t('HOME.CONTACT.EMAIL.001'),
})

export const getFooterContent = (t: Translator): FooterContent => ({
  brand: t('FOOTER.BRAND.001'),
  copyright: t('FOOTER.COPYRIGHT.001'),
  tagline: t('FOOTER.TAGLINE.001'),
})
