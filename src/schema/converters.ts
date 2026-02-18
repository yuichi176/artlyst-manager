import { RawExhibition, RawMuseum } from './db'
import { Exhibition, Museum } from './ui'

/**
 * Convert RawExhibition (DB layer with Timestamp) to Exhibition (UI layer with ISO strings).
 */
export function convertRawExhibitionToExhibition(id: string, raw: RawExhibition): Exhibition {
  // Calculate event status based on current date
  const now = new Date()
  const startDate = raw.startDate ? raw.startDate.toDate() : null
  const endDate = raw.endDate ? raw.endDate.toDate() : null

  let eventStatus: 'ongoing' | 'upcoming' | 'ended' | undefined
  if (startDate && endDate) {
    if (startDate <= now && now <= endDate) {
      eventStatus = 'ongoing'
    } else if (now < startDate) {
      eventStatus = 'upcoming'
    } else if (endDate < now) {
      eventStatus = 'ended'
    }
  }

  return {
    id,
    title: raw.title,
    museumId: raw.museumId,
    venue: raw.venue ?? '',
    startDate: raw.startDate ? raw.startDate.toDate().toISOString().split('T')[0] : '',
    endDate: raw.endDate ? raw.endDate.toDate().toISOString().split('T')[0] : '',
    officialUrl: raw.officialUrl ?? '',
    imageUrl: raw.imageUrl ?? '',
    status: raw.status,
    origin: raw.origin ?? '',
    updatedAt: raw.updatedAt ? raw.updatedAt.toDate().toISOString().split('T')[0] : '',
    createdAt: raw.createdAt ? raw.createdAt.toDate().toISOString().split('T')[0] : '',
    eventStatus,
  }
}

/**
 * Convert RawMuseum (DB layer with Timestamp) to Museum (UI layer with ISO strings).
 */
export function convertRawMuseumToMuseum(id: string, raw: RawMuseum): Museum {
  return {
    id,
    name: raw.name,
    address: raw.address,
    access: raw.access,
    openingInformation: raw.openingInformation,
    venueType: raw.venueType,
    area: raw.area,
    region: raw.region,
    officialUrl: raw.officialUrl,
    scrapeUrl: raw.scrapeUrl,
    scrapeEnabled: raw.scrapeEnabled,
    createdAt: raw.createdAt?.toDate().toISOString().split('T')[0],
    updatedAt: raw.updatedAt?.toDate().toISOString().split('T')[0],
  }
}
