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
  scrape: {
    enabled: boolean
    scrapeUrls: string[]
    lastScrapedAt?: Timestamp
  }
  aliases?: string[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
