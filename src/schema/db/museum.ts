import { Timestamp } from '@google-cloud/firestore'
import type { Area, VenueType, Region } from '@/schema/common/museum'

export type RawMuseum = {
  name: string
  address: string
  access: string
  openingInformation?: string
  venueType: VenueType
  area: Area
  region: Region
  officialUrl: string
  scrapeUrl: string
  scrapeEnabled: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
