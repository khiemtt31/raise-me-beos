'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <CardTitle className="text-2xl text-red-600 dark:text-red-400">
            Payment Cancelled
          </CardTitle>
          <CardDescription>
            Your donation was not completed. No charges were made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            If you experienced any issues, please try again or contact support.
          </p>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href="/">Go Home</Link>
            </Button>
            <Button
              asChild
              className="flex-1"
            >
              <Link href="/donate">Try Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CancelPage