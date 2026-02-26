import type { DonationHistoryQueryDTO, DonationHistoryResponseDTO } from '@/types/api'

type ApiRequestOptions = RequestInit & {
  i18nKey: string
  parseJson?: boolean
}

export class ApiError extends Error {
  errorCode: string
  i18nKey: string
  status?: number

  constructor(errorCode: string, i18nKey: string, message: string, status?: number) {
    super(message)
    this.errorCode = errorCode
    this.i18nKey = i18nKey
    this.status = status
  }
}

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
}

const getApiBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL?.replace(/\/$/, '') ?? ''

const getEndpoint = (path: string): string => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}${path}` : path
}

const apiRequest = async <T>(
  path: string,
  { i18nKey, parseJson = true, headers, ...options }: ApiRequestOptions
): Promise<T> => {
  const response = await fetch(getEndpoint(path), {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    let message = i18nKey
    let errorCode = `HTTP_${response.status}`
    try {
      const data = await response.json()
      if (data && typeof data.errorCode === 'string') {
        errorCode = data.errorCode
      } else if (data && typeof data.code === 'string') {
        errorCode = data.code
      } else if (data && typeof data.error === 'string') {
        errorCode = data.error
      }
      if (data && typeof data.message === 'string') {
        message = data.message
      }
    } catch {
      message = i18nKey
    }
    throw new ApiError(errorCode, i18nKey, message, response.status)
  }

  if (!parseJson) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

// ============================================================================
// Payment API Functions
// ============================================================================

export interface CreatePaymentRequest {
  amount: number
  senderName: string
  message: string
  isAnonymous: boolean
}

export interface CreatePaymentResponse {
  qrCode: string
  checkoutUrl: string
  orderCode: string
}

/**
 * Create a new payment request
 * @param request Payment creation details
 * @returns Payment response with QR code and checkout URL
 */
export async function createPayment(
  request: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  return apiRequest<CreatePaymentResponse>('/api/payment/create', {
    method: 'POST',
    body: JSON.stringify(request),
    i18nKey: 'ERROR.MESSAGE.002',
  })
}

export interface PaymentStatusData {
  status: string
  [key: string]: unknown
}

type PaymentLinkResponse = {
  data?: {
    status?: string
  }
}

/**
 * Get payment status from PayOS (via payment service)
 * @param orderCode Order code to check
 * @returns Payment status data if available
 */
export async function getPaymentStatus(
  orderCode: string
): Promise<PaymentStatusData | null> {
  const response = await apiRequest<PaymentLinkResponse>(`/api/payment/${orderCode}`, {
    method: 'GET',
    i18nKey: 'ERROR.MESSAGE.003',
  })

  const status = response?.data?.status
  if (!status) return null

  return { status }
}

/**
 * Subscribe to payment status updates via Server-Sent Events
 * @param orderCode Order code to monitor
 * @param onMessage Callback when status message is received
 * @param onError Callback when error occurs
 * @returns Function to close the EventSource connection
 */
export function subscribeToPaymentStatus(
  orderCode: string,
  onMessage: (data: PaymentStatusData) => void,
  onError?: (error: Event) => void
): () => void {
  const eventSource = new EventSource(getEndpoint(`/api/sse/status/${orderCode}`), {
    withCredentials: true,
  })

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (error) {
      console.error('Failed to parse payment status message:', error)
    }
  }

  if (onError) {
    eventSource.onerror = onError
  } else {
    eventSource.onerror = () => {
      eventSource.close()
    }
  }

  // Return cleanup function
  return () => {
    eventSource.close()
  }
}

/**
 * Cancel a payment and update its status to FAIL
 * @param orderCode Order code to cancel
 * @param reason Optional cancellation reason
 */
export async function cancelPayment(
  orderCode: string,
  reason?: string
): Promise<void> {
  await apiRequest<void>(`/api/payment/${orderCode}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ cancellationReason: reason ?? 'User cancelled' }),
    i18nKey: 'ERROR.MESSAGE.002',
    parseJson: false,
  })
}

// ============================================================================
// Health Check API Functions
// ============================================================================

/**
 * Check the health of the payment service
 * @returns Promise that resolves if service is healthy
 */
export async function healthCheck(): Promise<void> {
  await apiRequest<void>('/healthz', {
    method: 'GET',
    parseJson: false,
    i18nKey: 'ERROR.MESSAGE.001',
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if API service is configured (not using relative URLs)
 */
export function isApiServiceConfigured(): boolean {
  return getApiBaseUrl().length > 0
}

// ============================================================================
// Donation History API Functions
// ============================================================================

export async function getDonationHistory(
  query: DonationHistoryQueryDTO = {}
): Promise<DonationHistoryResponseDTO> {
  const params = new URLSearchParams()
  if (query.page) {
    params.set('page', String(query.page))
  }
  if (query.limit) {
    params.set('limit', String(query.limit))
  }

  const search = params.toString()
  const path = search ? `/api/donations/history?${search}` : '/api/donations/history'

  return apiRequest<DonationHistoryResponseDTO>(path, {
    method: 'GET',
    i18nKey: 'ERROR.MESSAGE.003',
  })
}
