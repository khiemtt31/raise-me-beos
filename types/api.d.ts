export interface PaginationQueryDTO {
  page?: number
  limit?: number
}

export interface PaginationMetaDTO {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponseDTO<T> {
  data: T[]
  pagination: PaginationMetaDTO
}

export interface DonationHistoryItemDTO {
  id: string
  amount: number
  message: string | null
  senderName: string | null
  createdAt: string
  status: string
  isAnonymous: boolean
  method: string | null
}

export interface DonationHistoryQueryDTO extends PaginationQueryDTO {}

export type DonationHistoryResponseDTO = PaginatedResponseDTO<DonationHistoryItemDTO>
