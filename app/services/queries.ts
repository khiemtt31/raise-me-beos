import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusData,
} from '@/app/services/api'
import {
  cancelPayment,
  createPayment,
  healthCheck,
  getDonationHistory,
  getPaymentStatus,
  subscribeToPaymentStatus,
} from '@/app/services/api'
import type { DonationHistoryQueryDTO } from '@/types/api'

const normalizePaymentStatus = (status?: string | null) => {
  if (!status) return null
  const normalized = status.toUpperCase()

  if (normalized === 'PAID') return 'SUCCESS'
  if (normalized === 'PROCESSING') return 'PENDING'
  if (normalized === 'EXPIRED' || normalized === 'CANCELLED') return 'FAIL'
  if (normalized === 'UNDERPAID' || normalized === 'FAILED') return 'FAIL'

  return normalized
}

const isTerminalStatus = (status?: string | null) =>
  status === 'SUCCESS' || status === 'FAIL'

export { cancelPayment }

export const queryKeys = {
  health: ['healthz'] as const,
  payment: ['payment', 'latest'] as const,
  paymentStatus: (orderCode: string) => ['payment-status', orderCode] as const,
  donationHistoryBase: ['donations', 'history'] as const,
  donationHistory: (page: number, limit: number) =>
    ['donations', 'history', page, limit] as const,
}

export const useHealthCheckQuery = () =>
  useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => {
      await healthCheck()
      return { status: 'ok' }
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
  })

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CreatePaymentResponse, Error, CreatePaymentRequest>({
    mutationKey: ['payment', 'create'],
    mutationFn: createPayment,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.payment, data)
      queryClient.setQueryData(queryKeys.paymentStatus(data.orderCode), {
        status: 'PENDING',
      })
    },
  })
}

export const useLatestPayment = () =>
  useQuery<CreatePaymentResponse | null>({
    queryKey: queryKeys.payment,
    queryFn: () => Promise.resolve(null),
    initialData: null,
    enabled: false,
    staleTime: Infinity,
  })

export const usePaymentStatus = (orderCode: string | null, enabled: boolean) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!orderCode || !enabled) return

    const unsubscribe = subscribeToPaymentStatus(
      orderCode,
      (data) => {
        const normalizedStatus = normalizePaymentStatus(data.status)
        queryClient.setQueryData(queryKeys.paymentStatus(orderCode), {
          ...data,
          status: normalizedStatus ?? data.status,
        })
      },
      () => {
        queryClient.setQueryData(queryKeys.paymentStatus(orderCode), {
          status: 'ERROR',
        })
      }
    )

    return unsubscribe
  }, [orderCode, enabled, queryClient])

  useEffect(() => {
    if (!orderCode || !enabled) return

    let intervalId: ReturnType<typeof setInterval> | undefined
    let isActive = true
    const startedAt = Date.now()
    const maxDurationMs = 5 * 60 * 1000

    const poll = async () => {
      if (Date.now() - startedAt > maxDurationMs) {
        if (intervalId) clearInterval(intervalId)
        return
      }

      const currentStatus = queryClient.getQueryData<PaymentStatusData>(
        queryKeys.paymentStatus(orderCode)
      )?.status

      const normalizedCurrent = normalizePaymentStatus(currentStatus)
      if (isTerminalStatus(normalizedCurrent)) {
        if (intervalId) clearInterval(intervalId)
        return
      }

      try {
        const response = await getPaymentStatus(orderCode)
        if (!isActive || !response?.status) return

        const normalizedStatus = normalizePaymentStatus(response.status)
        if (!normalizedStatus) return

        queryClient.setQueryData(queryKeys.paymentStatus(orderCode), {
          ...response,
          status: normalizedStatus,
        })

        if (isTerminalStatus(normalizedStatus) && intervalId) {
          clearInterval(intervalId)
        }
      } catch {
        // Ignore polling errors - SSE may still be active.
      }
    }

    poll()
    intervalId = setInterval(poll, 10000)

    return () => {
      isActive = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [orderCode, enabled, queryClient])

  return useQuery<PaymentStatusData | null>({
    queryKey: orderCode ? queryKeys.paymentStatus(orderCode) : ['payment-status', 'idle'],
    queryFn: () => Promise.resolve(null),
    initialData: null,
    enabled: false,
    staleTime: Infinity,
  })
}

export const useDonationHistory = (params: DonationHistoryQueryDTO) => {
  const page = params.page ?? 1
  const limit = params.limit ?? 6

  return useQuery({
    queryKey: queryKeys.donationHistory(page, limit),
    queryFn: () => getDonationHistory({ page, limit }),
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  })
}
