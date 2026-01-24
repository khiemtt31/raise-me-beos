'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your generous donation. Your support means the world to us!
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Make Another Donation
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage