import { notFound } from 'next/navigation'
import db from '@/lib/firestore'
import { convertRawExhibitionToExhibition, convertRawMuseumToMuseum } from '@/schema/converters'
import type { RawExhibition, RawMuseum } from '@/schema/db'
import type { Exhibition } from '@/schema/ui'
import { MuseumDetailPresentation } from './museum-detail-presentation'

interface MuseumDetailSectionProps {
  id: string
}

const eventStatusPriority: Record<NonNullable<Exhibition['eventStatus']>, number> = {
  ongoing: 0,
  upcoming: 1,
  ended: 2,
}

function sortExhibitions(exhibitions: Exhibition[]): Exhibition[] {
  return exhibitions.sort((a, b) => {
    const priorityA = a.eventStatus ? eventStatusPriority[a.eventStatus] : 3
    const priorityB = b.eventStatus ? eventStatusPriority[b.eventStatus] : 3

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    if (a.eventStatus === 'ended' && b.eventStatus === 'ended') {
      return b.endDate.localeCompare(a.endDate)
    }

    return a.startDate.localeCompare(b.startDate)
  })
}

export default async function MuseumDetailSection({ id }: MuseumDetailSectionProps) {
  const museumSnapshot = await db.collection('museum').doc(id).get()

  if (!museumSnapshot.exists) {
    notFound()
  }

  const rawMuseum = museumSnapshot.data() as RawMuseum
  const museum = convertRawMuseumToMuseum(id, rawMuseum)

  const exhibitionsSnapshot = await db.collection('exhibition').where('museumId', '==', id).get()

  const exhibitions = sortExhibitions(
    exhibitionsSnapshot.docs
      .map((doc) => {
        const data = doc.data() as RawExhibition

        if (data.isExcluded === true) {
          return undefined
        }

        return convertRawExhibitionToExhibition(doc.id, data)
      })
      .filter((exhibition): exhibition is Exhibition => exhibition !== undefined),
  )

  return <MuseumDetailPresentation museum={museum} exhibitions={exhibitions} />
}
