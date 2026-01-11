'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import QRCode from 'react-qr-code'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { Heart, DollarSign } from 'lucide-react'

const AMOUNT_PRESETS = [10000, 20000, 50000, 100000, 200000, 500000]

export default function DonationPage() {
  const [amount, setAmount] = useState<number>(10000)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [senderName, setSenderName] = useState<string>('Anonymous')
  const [message, setMessage] = useState<string>('')
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [qrCode, setQrCode] = useState<string>('')
  const [showQR, setShowQR] = useState<boolean>(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string>('')
  const [orderCode, setOrderCode] = useState<string>('')

  useEffect(() => {
    if (!orderCode) return

    const paymentServiceBase =
      process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''

    const eventSource = new EventSource(`${paymentServiceBase}/api/sse/status/${orderCode}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.status === 'PAID') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        toast.success('Thank you for your donation!')
        setShowQR(false)
        setQrCode('')
        setOrderCode('')
        eventSource.close()
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [orderCode])

  const handleAmountSelect = (preset: number) => {
    setAmount(preset)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= 10000) {
      setAmount(num)
    }
  }

  const paymentServiceBase =
    process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''

  const getCreateEndpoint = () =>
    paymentServiceBase ? `${paymentServiceBase}/api/payment/create` : '/api/payment/create'

  const handleDonate = async () => {
    if (amount < 10000) {
      toast.error('Minimum donation amount is 10,000đ')
      return
    }

    if (amount > 50000000) {
      toast.error('Maximum donation amount is 50,000,000đ')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(getCreateEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          senderName,
          message,
          isAnonymous,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create payment')
      }

      const data = await response.json()
      setQrCode(data.qrCode)
      setOrderCode(data.orderCode)
      setCheckoutUrl(data.checkoutUrl)
      setShowQR(true)
      // Only open checkout URL in new tab, don't redirect
      window.open(data.checkoutUrl, '_blank')
    } catch (error: any) {
      console.error('Donation creation error:', error)
      toast.error(error.message || 'Failed to create donation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="text-red-500" />
            Make a Donation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div>
            <Label className="text-base font-medium">Select Amount</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {AMOUNT_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset && !customAmount ? 'default' : 'outline'}
                  onClick={() => handleAmountSelect(preset)}
                  className="text-sm"
                >
                  {preset.toLocaleString()}đ
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Label htmlFor="custom-amount">Or enter custom amount (min 10,000đ)</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min="10000"
                className="mt-1"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="sender-name">Your Name</Label>
              <Input
                id="sender-name"
                placeholder="Anonymous"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Leave a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Donate anonymously
              </Label>
            </div>
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            size="lg"
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Donate Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <QRCode value={qrCode} size={200} />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your banking app to complete payment
              </p>
              <p className="text-xs text-muted-foreground">
                A payment page has also been opened in a new tab
              </p>
            </div>
            <div className="flex space-x-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowQR(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => window.open(checkoutUrl, '_blank')}
                className="flex-1"
              >
                Open Payment Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}