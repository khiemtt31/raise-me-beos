import QRCode from 'react-qr-code'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { siteContent } from '@/skeleton-data/portfolio'

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[var(--hero-border)] bg-[var(--hero-surface-strong)] text-[var(--hero-foreground)]">
        <DialogHeader>
          <DialogTitle className="text-glow">{siteContent.paymentTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-bg)] p-4 text-[var(--hero-foreground)]">
            <QRCode value={qrCode} size={200} bgColor="transparent" fgColor="currentColor" />
          </div>
          <div className="text-center text-sm text-[var(--hero-muted)]">
            {siteContent.paymentDescription}
          </div>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
            >
              {siteContent.paymentClose}
            </Button>
            <Button
              onClick={() =>
                checkoutUrl &&
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
              }
              className="flex-1 bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
            >
              {siteContent.paymentOpen}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
