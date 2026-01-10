import db from '@/lib/firestore'
import { Museum } from '@/schema/museum'
import { MuseumEditForm } from './MuseumEditForm'
import { notFound } from 'next/navigation'

interface MuseumEditFormSectionProps {
  id: string
}

export const MuseumEditFormSection = async ({ id }: MuseumEditFormSectionProps) => {
  const museumCollectionRef = db.collection('museum').doc(id)
  const existingDocumentsSnapshot = await museumCollectionRef.get()

  if (!existingDocumentsSnapshot.exists) {
    notFound()
  }

  const data = existingDocumentsSnapshot.data() as Museum

  const museum: Museum = {
    id: id,
    name: data.name,
    address: data.address,
    access: data.access,
    openingInformation: data.openingInformation,
    venueType: data.venueType,
    area: data.area,
    officialUrl: data.officialUrl,
    scrapeUrl: data.scrapeUrl,
    scrapeEnabled: data.scrapeEnabled,
  } satisfies Museum

  return <MuseumEditForm museum={museum} />
}
