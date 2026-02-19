import { Timestamp } from '@google-cloud/firestore'
import { Status } from '@/schema/common/exhibition'

export type RawExhibition = {
  title: string
  museumId: string
  venue: string
  startDate?: Timestamp
  endDate?: Timestamp
  officialUrl?: string
  imageUrl?: string
  status: Status
  origin?: string
  isExcluded?: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
