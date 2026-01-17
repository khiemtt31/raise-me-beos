import { ArrowDown, DollarSign, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  donationContent,
  donationPresets,
  heroContent,
} from '@/skeleton-data/portfolio'

type HeroSectionProps = {
  amount: number
  customAmount: string
  senderName: string
  message: string
  isAnonymous: boolean
  isLoading: boolean
  onAmountSelect: (preset: number) => void
  onCustomAmountChange: (value: string) => void
  onSenderNameChange: (value: string) => void
  onMessageChange: (value: string) => void
  onAnonymousChange: (checked: boolean) => void
  onDonate: () => void
}
 
export function HeroSection({
  amount,
  customAmount,
  senderName,
  message,
  isAnonymous,
  isLoading,
  onAmountSelect,
  onCustomAmountChange,
  onSenderNameChange,
  onMessageChange,
  onAnonymousChange,
  onDonate,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      data-section="hero"
      data-sphere
      className="sphere-section grid min-h-[85vh] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20"
    >
      <div data-reveal className="reveal space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--hero-accent)] animate-pulse" />
          {heroContent.pill}
        </div>
        <h1 className="text-4xl font-sans leading-tight text-glow md:text-6xl">
          {heroContent.title}
        </h1>
        <p className="text-lg text-[var(--hero-muted)]">{heroContent.subtitle}</p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="neon-border bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
          >
            <a href="#projects">{heroContent.primaryCta}</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
          >
            <a href="#milestones">{heroContent.secondaryCta}</a>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          {heroContent.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--hero-border)] px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          <span className="h-px w-10 bg-[var(--hero-border)]" />
          {heroContent.scrollHint}
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>

      <div id="donate" data-reveal className="reveal glass-panel neon-border rounded-3xl p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                {donationContent.eyebrow}
              </p>
              <h2 className="text-2xl font-sans text-glow">{donationContent.title}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]">
              <Heart className="h-5 w-5 text-[var(--hero-foreground)]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
            <span>{donationContent.amountLabel}</span>
            <span className="text-[var(--hero-foreground)]">
              {amount.toLocaleString()} VND
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {donationPresets.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => onAmountSelect(preset)}
                className={cn(
                  'h-11 rounded-xl border text-[11px] uppercase tracking-[0.2em]',
                  amount === preset && !customAmount
                    ? 'border-[var(--hero-accent)] bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)]'
                    : 'border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]'
                )}
              >
                {preset.toLocaleString()}
              </Button>
            ))}
          </div>

          <div>
            <Label
              htmlFor="custom-amount"
              className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
            >
              {donationContent.customAmountLabel}
            </Label>
            <Input
              id="custom-amount"
              type="number"
              placeholder={donationContent.customAmountPlaceholder}
              value={customAmount}
              onChange={(e) => onCustomAmountChange(e.target.value)}
              min="10000"
              className="mt-2 border-[var(--hero-border)] bg-[var(--hero-surface)] text-[var(--hero-foreground)] placeholder:text-[var(--hero-muted)]"
            />
          </div>

          <div className="grid gap-4">
            <div>
              <Label
                htmlFor="sender-name"
                className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
              >
                {donationContent.nameLabel}
              </Label>
              <Input
                id="sender-name"
                placeholder={donationContent.namePlaceholder}
                value={senderName}
                onChange={(e) => onSenderNameChange(e.target.value)}
                className="mt-2 border-[var(--hero-border)] bg-[var(--hero-surface)] text-[var(--hero-foreground)] placeholder:text-[var(--hero-muted)]"
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
              >
                {donationContent.messageLabel}
              </Label>
              <Textarea
                id="message"
                placeholder={donationContent.messagePlaceholder}
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                className="mt-2 border-[var(--hero-border)] bg-[var(--hero-surface)] text-[var(--hero-foreground)] placeholder:text-[var(--hero-muted)]"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => onAnonymousChange(checked as boolean)}
                className="border-[var(--hero-border)] data-[state=checked]:bg-[var(--hero-accent)] data-[state=checked]:text-[var(--hero-accent-contrast)]"
              />
              <Label
                htmlFor="anonymous"
                className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]"
              >
                {donationContent.anonymousLabel}
              </Label>
            </div>
          </div>

          <Button
            onClick={onDonate}
            disabled={isLoading}
            className="neon-border h-11 w-full bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
          >
            {isLoading ? (
              donationContent.processingLabel
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                {donationContent.buttonLabel}
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
