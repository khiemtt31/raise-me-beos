import type { DonationHistoryQueryDTO, DonationHistoryResponseDTO } from '@/types/api'

type ApiRequestOptions = RequestInit & {
  errorKey: string
  parseJson?: boolean
}

export class ApiError extends Error {
  code: string
  status?: number

  constructor(code: string, message: string, status?: number) {
    super(message)
    this.code = code
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
  { errorKey, parseJson = true, headers, ...options }: ApiRequestOptions
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
    let message = errorKey
    try {
      const data = await response.json()
      if (data && typeof data.message === 'string') {
        message = data.message
      }
    } catch {
      message = errorKey
    }
    throw new ApiError(errorKey, message, response.status)
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
    errorKey: 'ERROR.MESSAGE.002',
  })
}

export interface PaymentStatusData {
  status: string
  [key: string]: unknown
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
    errorKey: 'ERROR.MESSAGE.001',
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
    errorKey: 'ERROR.MESSAGE.003',
  })
}
