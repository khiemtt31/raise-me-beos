import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Copy, ExternalLink, Smartphone, CheckCircle, Clock, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { getSiteContent } from '@/skeleton-data/portfolio'
import { toast } from 'sonner'

type PaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCode: string
  checkoutUrl: string
  isProcessing?: boolean
  onCancel?: () => void
}

export function PaymentDialog({
  open,
  onOpenChange,
  qrCode,
  checkoutUrl,
  isProcessing = false,
  onCancel,
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
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        className="border-2 border-[var(--hero-border)]/50 bg-[var(--hero-surface-strong)] text-[var(--hero-foreground)] max-w-md shadow-2xl backdrop-blur-xl"
      >
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-lg bg-gradient-to-br from-[var(--hero-surface-strong)]/98 to-[var(--hero-surface-strong)]/95 backdrop-blur-md">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[var(--hero-accent)] blur-xl opacity-50 animate-pulse" />
              <Loader2 className="relative h-14 w-14 animate-spin text-[var(--hero-accent)]" />
            </div>
            <p className="text-lg font-bold text-[var(--hero-foreground)] tracking-wide">
              {t('PAYMENT.PROCESSING.001')}
            </p>
            <p className="text-sm text-[var(--hero-muted)] text-center px-6 leading-relaxed">
              {t('PAYMENT.PROCESSING.002')}
            </p>
          </div>
        )}
        <DialogHeader className="text-center space-y-3 pb-2">
          <DialogTitle className="text-glow text-2xl font-bold flex items-center justify-center gap-3">
            <Smartphone className="h-6 w-6 text-[var(--hero-accent)]" />
            {siteContent.paymentTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t('PAYMENT.TEXT.001')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-5">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--hero-accent)] to-purple-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />

              <div className="relative rounded-3xl border-2 border-[var(--hero-border)] bg-gradient-to-br from-[var(--hero-bg)] to-[var(--hero-surface)] p-8 shadow-2xl backdrop-blur-sm">
                <QRCode
                  value={qrCode}
                  size={200}
                  bgColor="transparent"
                  fgColor="currentColor"
                  className="rounded-xl"
                />
              </div>
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-[var(--hero-accent)] animate-pulse opacity-40" />
            </div>

            {/* Timer with enhanced styling */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--hero-accent)] to-purple-500 blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative flex items-center gap-3 rounded-full border-2 border-[var(--hero-border)] bg-[var(--hero-surface)]/80 px-5 py-2.5 backdrop-blur-sm shadow-lg">
                <Clock className="h-5 w-5 text-[var(--hero-accent)] animate-pulse" />
                <span className="text-sm text-[var(--hero-muted)] font-medium">
                  {t('PAYMENT.LABEL.001')}{' '}
                  <span className="font-mono text-[var(--hero-accent)] font-bold text-base">
                    {formatTime(timeLeft)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-center">
            <div className="text-sm text-[var(--hero-muted)] leading-relaxed font-medium px-2">
              {siteContent.paymentDescription}
            </div>

            {/* Step by step with enhanced styling */}
            <div className="rounded-2xl border border-[var(--hero-border)]/50 bg-[var(--hero-surface)]/30 backdrop-blur-sm p-4 space-y-2.5">
              <div className="flex items-center gap-3 justify-center group hover:scale-105 transition-transform">
                <CheckCircle className="h-4 w-4 text-green-400 group-hover:animate-pulse" />
                <span className="text-sm text-[var(--hero-foreground)]">{t('PAYMENT.STEP.001')}</span>
              </div>
              <div className="flex items-center gap-3 justify-center group hover:scale-105 transition-transform">
                <CheckCircle className="h-4 w-4 text-green-400 group-hover:animate-pulse" />
                <span className="text-sm text-[var(--hero-foreground)]">{t('PAYMENT.STEP.002')}</span>
              </div>
              <div className="flex items-center gap-3 justify-center group hover:scale-105 transition-transform">
                <CheckCircle className="h-4 w-4 text-green-400 group-hover:animate-pulse" />
                <span className="text-sm text-[var(--hero-foreground)]">{t('PAYMENT.STEP.003')}</span>
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
              className="w-full h-14 bg-gradient-to-r from-[var(--hero-accent)] via-purple-500 to-[var(--hero-accent)] bg-[length:200%_100%] text-white hover:bg-[position:100%_0] text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="relative flex items-center justify-center gap-2">
                <ExternalLink className="h-5 w-5" />
                {siteContent.paymentOpen}
              </div>
            </Button>

            {/* Secondary actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex-1 h-12 border-2 border-[var(--hero-border)] bg-[var(--hero-surface)]/50 text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)] hover:scale-105 active:scale-95 transition-all rounded-xl backdrop-blur-sm shadow-md"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                    <span className="font-semibold">{t('PAYMENT.BUTTON.004')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    <span className="font-semibold">{t('PAYMENT.BUTTON.003')}</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (onCancel) {
                    onCancel()
                  } else {
                    onOpenChange(false)
                  }
                }}
                className="flex-1 h-12 border-2 border-[var(--hero-border)] bg-[var(--hero-surface)]/50 text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)] hover:scale-105 active:scale-95 transition-all rounded-xl backdrop-blur-sm shadow-md"
              >
                <span className="font-semibold">{siteContent.paymentClose}</span>
              </Button>
            </div>
          </div>

          {/* Security note */}
          <div className="text-center rounded-2xl border border-[var(--hero-border)]/50 bg-[var(--hero-surface)]/20 backdrop-blur-sm p-4 space-y-1">
            <p className="text-xs text-[var(--hero-muted)] leading-relaxed">{t('PAYMENT.SECURITY.001')}</p>
            <p className="text-xs text-[var(--hero-muted)] leading-relaxed">{t('PAYMENT.SECURITY.002')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
