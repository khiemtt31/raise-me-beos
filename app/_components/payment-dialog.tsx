import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Copy, ExternalLink, Smartphone, CheckCircle, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { getSiteContent } from '@/skeleton-data/portfolio'
import { toast } from 'sonner'

type PaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCode: string
  checkoutUrl: string
}

export function PaymentDialog({
  open,
  onOpenChange,
  qrCode,
  checkoutUrl,
}: PaymentDialogProps) {
  const t = useTranslations()
  const siteContent = getSiteContent(t)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (!open) {
      setTimeLeft(300)
      return undefined
    }

    setTimeLeft(300)
    intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalId) clearInterval(intervalId)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [open, qrCode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(checkoutUrl)
      setCopied(true)
      toast.success(t('PAYMENT.TOAST.001'))
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error(t('PAYMENT.TOAST.002'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[var(--hero-border)] bg-[var(--hero-surface-strong)] text-[var(--hero-foreground)] max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-glow text-xl flex items-center justify-center gap-2">
            <Smartphone className="h-5 w-5" />
            {siteContent.paymentTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="rounded-2xl border-2 border-[var(--hero-border)] bg-[var(--hero-bg)] p-6 shadow-2xl">
                <QRCode
                  value={qrCode}
                  size={180}
                  bgColor="transparent"
                  fgColor="currentColor"
                  className="rounded-lg"
                />
              </div>
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border border-[var(--hero-accent)] animate-pulse opacity-50" />
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm text-[var(--hero-muted)]">
              <Clock className="h-4 w-4" />
              <span>
                {t('PAYMENT.LABEL.001')}{' '}
                <span className="font-mono text-[var(--hero-accent)]">
                  {formatTime(timeLeft)}
                </span>
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-center">
            <div className="text-sm text-[var(--hero-muted)] leading-relaxed">
              {siteContent.paymentDescription}
            </div>

            {/* Step by step */}
            <div className="space-y-2 text-xs text-[var(--hero-muted)]">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-3 w-3 text-green-400" />
                <span>{t('PAYMENT.STEP.001')}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-3 w-3 text-green-400" />
                <span>{t('PAYMENT.STEP.002')}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-3 w-3 text-green-400" />
                <span>{t('PAYMENT.STEP.003')}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Primary action - Open payment page */}
            <Button
              onClick={() =>
                checkoutUrl &&
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
              }
              className="w-full h-12 bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)] text-base font-medium"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {siteContent.paymentOpen}
            </Button>

            {/* Secondary actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex-1 border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                    {t('PAYMENT.BUTTON.004')}
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {t('PAYMENT.BUTTON.003')}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
              >
                {siteContent.paymentClose}
              </Button>
            </div>
          </div>

          {/* Security note */}
          <div className="text-center text-xs text-[var(--hero-muted)] border-t border-[var(--hero-border)] pt-4">
            <p>{t('PAYMENT.SECURITY.001')}</p>
            <p>{t('PAYMENT.SECURITY.002')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
